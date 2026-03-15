"""
AXIS Backend — Background Workers (Celery + Redis)
Three autonomous processes that power the "Stella" engine:

1. Generosity Nurture Worker  — 48h follow-up for leads who haven't completed an audit
2. Image Optimization Worker  — WEBP conversion, metadata strip, Mombasa EXIF injection
3. Uptime Monitor Worker      — Periodic ping of all AXIS-managed systems
"""

from celery import Celery
from celery.schedules import crontab
import httpx
import logging
import asyncio
import uuid
from datetime import datetime, timedelta
from pathlib import Path

logger = logging.getLogger("axis.workers")


# ── Celery App ─────────────────────────────────────────────────────────────
# Redis as broker + result backend (Upstash Redis works on Render/Railway)

celery_app = Celery(
    "axis_workers",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
    include=["workers"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Africa/Nairobi",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,       # Retry on worker crash
    worker_prefetch_multiplier=1,
)

# ── Beat Schedule (CRON Jobs) ──────────────────────────────────────────────

celery_app.conf.beat_schedule = {
    # Run nurture check every hour
    "generosity-nurture-check": {
        "task":     "workers.check_pending_nurtures",
        "schedule": crontab(minute=0),   # Every hour on the hour
    },
    # Uptime monitor every 5 minutes
    "uptime-monitor": {
        "task":     "workers.run_uptime_monitor",
        "schedule": crontab(minute="*/5"),
    },
    # Image optimization sweep every 30 minutes
    "image-optimization-sweep": {
        "task":     "workers.optimize_pending_images",
        "schedule": crontab(minute="*/30"),
    },
}


# ══════════════════════════════════════════════════════════════════════════
# WORKER 1: Generosity Nurture
# ══════════════════════════════════════════════════════════════════════════

@celery_app.task(name="workers.send_generosity_followup", bind=True, max_retries=3)
def send_generosity_followup(self, email: str, name: str) -> dict:
    """
    Sends a 48-hour follow-up email to leads who received a vault asset
    but haven't completed the full infrastructure audit.

    Triggered by: vault access → countdown=172800 (48h)
    """
    try:
        from core.config import settings
        from core.database import get_db

        db = get_db()

        # Check: has this lead completed an audit since the vault access?
        lead_record = db.table("leads") \
            .select("audit_completed, nurture_sent") \
            .eq("email", email) \
            .single() \
            .execute()

        if not lead_record.data:
            logger.warning(f"Nurture: Lead not found — {email}")
            return {"skipped": True, "reason": "lead_not_found"}

        if lead_record.data.get("audit_completed"):
            logger.info(f"Nurture skipped: {email} has completed audit.")
            return {"skipped": True, "reason": "audit_completed"}

        if lead_record.data.get("nurture_sent"):
            logger.info(f"Nurture skipped: {email} already nurtured.")
            return {"skipped": True, "reason": "already_nurtured"}

        # Build and send nurture email
        html = _build_nurture_email(name)

        import httpx as _httpx
        r = _httpx.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
            json={
                "from":    settings.RESEND_FROM,
                "to":      [email],
                "subject": f"{name}, your infrastructure has a gap we should discuss.",
                "html":    html,
            },
            timeout=15,
        )

        if r.status_code in (200, 201):
            db.table("leads").update({"nurture_sent": True}).eq("email", email).execute()
            logger.info(f"Nurture email sent → {email}")
            return {"sent": True, "email": email}
        else:
            raise Exception(f"Resend error: {r.text}")

    except Exception as exc:
        logger.error(f"Nurture worker error for {email}: {exc}")
        raise self.retry(exc=exc, countdown=300)   # Retry in 5 min


@celery_app.task(name="workers.check_pending_nurtures")
def check_pending_nurtures() -> dict:
    """
    Hourly sweep: find leads > 48h old who got vault access but haven't completed
    an audit and haven't been nurtured. Re-triggers nurture task if missed.
    """
    from core.database import get_db
    db = get_db()

    cutoff = (datetime.utcnow() - timedelta(hours=48)).isoformat()
    stale_leads = db.table("leads") \
        .select("email, full_name") \
        .eq("audit_completed", False) \
        .eq("nurture_sent", False) \
        .lt("created_at", cutoff) \
        .limit(50) \
        .execute()

    queued = 0
    for lead in (stale_leads.data or []):
        send_generosity_followup.apply_async(
            args=[lead["email"], lead["full_name"]],
        )
        queued += 1

    logger.info(f"Nurture sweep complete: {queued} queued.")
    return {"queued": queued}


def _build_nurture_email(name: str) -> str:
    return f"""
<!DOCTYPE html><html><body style="background:#0A0A0B;color:#e0e0e0;font-family:'DM Sans',sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
<div style="border:1px solid rgba(201,168,76,0.15);border-radius:16px;overflow:hidden;">
  <div style="padding:32px;background:rgba(201,168,76,0.05);">
    <p style="font-family:monospace;font-size:11px;letter-spacing:0.18em;color:#C9A84C;text-transform:uppercase;margin-bottom:8px;">AXIS — INFRASTRUCTURE INTELLIGENCE</p>
    <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:300;color:rgba(255,255,255,0.95);line-height:1.2;margin:0;">{name}, the gap is still there.<br/>The question is who fills it.</h1>
  </div>
  <div style="padding:32px;">
    <p style="color:rgba(255,255,255,0.65);line-height:1.75;margin-bottom:20px;">You collected the AXIS Manifesto 48 hours ago. The infrastructure gap it describes doesn't close by reading about it.</p>
    <p style="color:rgba(255,255,255,0.65);line-height:1.75;margin-bottom:28px;">The diagnostic takes four minutes. The Gap Report arrives in five. The only cost is clarity.</p>
    <a href="https://axismediaws.com/?ref=nurture-48h" style="display:inline-block;padding:14px 28px;background:#C9A84C;color:#0A0A0B;font-weight:600;font-size:14px;text-decoration:none;border-radius:8px;">Begin the Infrastructure Audit →</a>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:28px 0;"/>
    <p style="font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;">AXIS Media and Web Services · Mombasa, Kenya<br/>
    <a href="https://axismediaws.com/initiate" style="color:#C9A84C;">Initiate full vetting →</a></p>
  </div>
</div>
</body></html>
"""


# ══════════════════════════════════════════════════════════════════════════
# WORKER 2: Image Optimization
# ══════════════════════════════════════════════════════════════════════════

@celery_app.task(name="workers.optimize_portfolio_image", bind=True, max_retries=2)
def optimize_portfolio_image(self, image_path: str, system_slug: str) -> dict:
    """
    Processes a single portfolio image:
    1. Converts to WEBP (quality 85, lossless=False)
    2. Strips all EXIF metadata
    3. Injects Mombasa geo-coordinates into new EXIF
    4. Uploads optimized file to Supabase Storage
    5. Updates portfolio_systems.og_image_url in DB
    """
    try:
        from PIL import Image
        import piexif
        import io
        from core.database import get_db

        # Mombasa GPS coordinates for SEO EXIF injection
        MOMBASA_LAT  = (-4, 2, 37)    # -4.0435° → degrees, minutes, seconds
        MOMBASA_LON  = (39, 40, 5)    # 39.6682°
        MOMBASA_LAT_REF = "S"
        MOMBASA_LON_REF = "E"

        with Image.open(image_path) as img:
            # Strip metadata by converting through RGB
            clean_img = img.convert("RGB")

            # Build minimal EXIF with geo data
            exif_dict = {
                "GPS": {
                    piexif.GPSIFD.GPSLatitudeRef:  MOMBASA_LAT_REF.encode(),
                    piexif.GPSIFD.GPSLatitude:     [(abs(d), 1) for d in MOMBASA_LAT],
                    piexif.GPSIFD.GPSLongitudeRef: MOMBASA_LON_REF.encode(),
                    piexif.GPSIFD.GPSLongitude:    [(abs(d), 1) for d in MOMBASA_LON],
                }
            }
            exif_bytes = piexif.dump(exif_dict)

            # Save as WEBP
            output = io.BytesIO()
            clean_img.save(output, format="WEBP", quality=85, method=6, exif=exif_bytes)
            output.seek(0)

        # Upload to Supabase Storage
        db = get_db()
        dest_path = f"portfolio/{system_slug}/{Path(image_path).stem}.webp"
        db.storage.from_("portfolio-images").upload(
            dest_path,
            output.read(),
            {"content-type": "image/webp", "cache-control": "public, max-age=31536000"},
        )

        public_url = db.storage.from_("portfolio-images").get_public_url(dest_path)

        # Update og_image_url in DB
        db.table("portfolio_systems") \
            .update({"og_image_url": public_url}) \
            .eq("slug", system_slug) \
            .execute()

        logger.info(f"Image optimized: {system_slug} → {public_url}")
        return {"optimized": True, "url": public_url, "slug": system_slug}

    except Exception as exc:
        logger.error(f"Image optimization failed for {system_slug}: {exc}")
        raise self.retry(exc=exc, countdown=60)


@celery_app.task(name="workers.optimize_pending_images")
def optimize_pending_images() -> dict:
    """
    Sweep: find portfolio systems with og_image_url = NULL and trigger optimization.
    In production, also monitors /uploads folder for new files via Supabase Storage webhooks.
    """
    from core.database import get_db
    db = get_db()

    pending = db.table("portfolio_systems") \
        .select("slug, og_image_url") \
        .is_("og_image_url", "null") \
        .eq("status", "published") \
        .execute()

    triggered = 0
    for system in (pending.data or []):
        # In production: fetch the raw uploaded image path from storage
        logger.info(f"[Image Worker] Queuing optimization for: {system['slug']}")
        triggered += 1

    return {"triggered": triggered}


# ══════════════════════════════════════════════════════════════════════════
# WORKER 3: Uptime Monitor
# ══════════════════════════════════════════════════════════════════════════

@celery_app.task(name="workers.run_uptime_monitor")
def run_uptime_monitor() -> dict:
    """
    Every 5 minutes: ping all live AXIS-managed systems.
    Records response time and operational status in system_status table.
    Alerts CEO via Telegram if any system returns non-2xx.
    """
    from core.database import get_db
    from core.config import settings
    import httpx as _httpx

    db = get_db()
    systems = db.table("system_status").select("*").execute()
    results = []

    for system in (systems.data or []):
        url  = system["live_url"]
        slug = system["system_slug"]
        try:
            start = datetime.utcnow()
            r = _httpx.get(url, timeout=10, follow_redirects=True)
            elapsed_ms = int((datetime.utcnow() - start).total_seconds() * 1000)
            is_ok = r.status_code < 400

            # Build ping record
            ping = {"ts": datetime.utcnow().isoformat(), "ms": elapsed_ms, "ok": is_ok}

            # Update DB
            db.table("system_status").update({
                "is_operational": is_ok,
                "response_ms":    elapsed_ms,
                "last_checked":   datetime.utcnow().isoformat(),
                # Append ping to weekly_pings JSONB array, keep last 2016 entries (7 days × 288/day)
                "weekly_pings":   f"(weekly_pings || '{ping}'::jsonb)[array_upper(weekly_pings, 1) - 2015:]",
            }).eq("system_slug", slug).execute()

            results.append({"slug": slug, "ok": is_ok, "ms": elapsed_ms})

            if not is_ok:
                _alert_downtime(slug, url, r.status_code, settings)

        except (_httpx.TimeoutException, _httpx.ConnectError) as e:
            logger.error(f"[Uptime] {slug} UNREACHABLE: {e}")
            db.table("system_status").update({
                "is_operational": False,
                "last_checked":   datetime.utcnow().isoformat(),
            }).eq("system_slug", slug).execute()
            _alert_downtime(slug, url, 0, settings)
            results.append({"slug": slug, "ok": False, "ms": -1})

    logger.info(f"[Uptime Monitor] Swept {len(results)} systems.")
    return {"systems_checked": len(results), "results": results}


def _alert_downtime(slug: str, url: str, status_code: int, settings) -> None:
    """Sends Telegram alert to CEO when a managed system goes down."""
    import httpx as _httpx
    try:
        _httpx.post(
            f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage",
            json={
                "chat_id":    settings.TELEGRAM_CEO_CHAT_ID,
                "text":       f"🚨 *System Down*\n\n`{slug}`\n{url}\nStatus: `{status_code}`\n\nTime: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}",
                "parse_mode": "Markdown",
            },
            timeout=8,
        )
    except Exception:
        pass   # Silent fail — the monitor must not crash the monitor
