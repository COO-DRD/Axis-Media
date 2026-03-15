"""
AXIS Backend — /api/v1/audit
Receives diagnostic JSON → scores → stores lead → generates PDF gap report → emails via Resend.
"""

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import uuid
import logging
from datetime import datetime

from core.config import settings
from core.database import get_db

logger = logging.getLogger("axis.audit")
router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────────────

class AuditPayload(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    website: Optional[str] = None
    responses: Optional[Dict[str, Any]] = None
    authority_score: Optional[int] = None  # Pre-calculated from initiate page
    source: Optional[str] = "homepage"


class AuditResponse(BaseModel):
    success: bool
    lead_id: Optional[str] = None
    authority_score: int
    report_dispatched: bool
    message: str


# ── Scoring Engine ─────────────────────────────────────────────────────────

SCORE_WEIGHT = {
    "revenue_tier":   {"Under KES 100K": 1, "KES 100K – 500K": 2, "KES 500K – 2M": 3, "KES 2M+": 4},
    "gap_count":      lambda gaps: min(len(gaps), 4),
    "commitment":     {"I avoid it": 1, "I use it reluctantly": 2, "I see the potential": 3, "complete overhaul": 4},
}

def calculate_authority_score(responses: Dict[str, Any]) -> int:
    """
    Score 1–16 based on audit responses.
    12+ = High Authority (hot lead)
    7–11 = Mid Authority (nurture sequence)
    <7   = Low Authority (gift first)
    """
    if not responses:
        return 0
    score = 0
    for step_key, answer in responses.items():
        if isinstance(answer, list):
            score += min(len(answer) * 2, 6)
        elif isinstance(answer, str):
            score += 2
    return min(score, 16)


# ── Background Tasks ───────────────────────────────────────────────────────

async def store_lead_and_audit(payload: AuditPayload, lead_id: str, score: int) -> None:
    """
    1. Upsert lead into leads table.
    2. Insert infrastructure_audits record.
    3. Notify CEO via Telegram if score >= 12.
    """
    db = get_db()
    try:
        # Upsert lead
        db.table("leads").upsert({
            "id": lead_id,
            "email": payload.email,
            "full_name": payload.name,
            "phone": payload.phone,
            "authority_score": score,
            "source": payload.source,
            "created_at": datetime.utcnow().isoformat(),
        }, on_conflict="email").execute()

        # Insert audit record
        db.table("infrastructure_audits").insert({
            "lead_id": lead_id,
            "gap_analysis": payload.responses or {},
            "budget_tier": _score_to_budget_tier(score),
            "report_url": None,  # Updated once PDF is generated
        }).execute()

        logger.info(f"Lead stored: {payload.email} | Score: {score}")

    except Exception as e:
        logger.error(f"DB error for {payload.email}: {e}")


async def generate_and_send_report(
    payload: AuditPayload, lead_id: str, score: int
) -> None:
    """
    Generates PDF gap report via ReportLab/WeasyPrint, uploads to Supabase Storage,
    sends via Resend, and updates report_url in DB.
    """
    try:
        report_url = await _generate_pdf_report(payload, score)
        await _send_report_email(payload, report_url, score)

        # Update report URL in DB
        db = get_db()
        db.table("infrastructure_audits").update({
            "report_url": report_url
        }).eq("lead_id", lead_id).execute()

        logger.info(f"Gap Report dispatched to {payload.email}")

        # Trigger Telegram alert for high-authority leads
        if score >= 12:
            await _notify_ceo_telegram(payload, score)

    except Exception as e:
        logger.error(f"Report generation failed for {payload.email}: {e}")


async def _generate_pdf_report(payload: AuditPayload, score: int) -> str:
    """
    Generates a custom Infrastructure Gap Report PDF.
    Uses WeasyPrint with an HTML template, or ReportLab for production.
    Returns Supabase Storage URL.
    """
    # Production: build HTML template, render via WeasyPrint, upload to Supabase Storage
    # Placeholder: return a static PDF URL for now
    filename = f"gap-report-{uuid.uuid4().hex[:8]}.pdf"
    return f"https://storage.axismediaws.com/gap-reports/{filename}"


async def _send_report_email(payload: AuditPayload, report_url: str, score: int) -> None:
    """Send gap report via Resend API."""
    import httpx
    tier_label = _score_to_budget_tier(score)
    subject    = f"Your AXIS Infrastructure Gap Report — {tier_label} Profile"
    body_html  = _build_email_html(payload.name, report_url, score, tier_label)

    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
            json={
                "from":    settings.RESEND_FROM,
                "to":      [payload.email],
                "subject": subject,
                "html":    body_html,
            },
            timeout=15,
        )
        if r.status_code not in (200, 201):
            logger.error(f"Resend error: {r.text}")


def _build_email_html(name: str, report_url: str, score: int, tier: str) -> str:
    return f"""
<!DOCTYPE html><html><body style="background:#0A0A0B;color:#e0e0e0;font-family:'DM Sans',sans-serif;max-width:600px;margin:0 auto;padding:40px 24px;">
<div style="border:1px solid rgba(201,168,76,0.2);border-radius:16px;overflow:hidden;">
  <div style="padding:32px;background:linear-gradient(135deg,rgba(201,168,76,0.08),rgba(20,20,23,0.95));">
    <p style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.2em;color:#C9A84C;text-transform:uppercase;margin-bottom:8px;">AXIS INFRASTRUCTURE DIAGNOSTIC</p>
    <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:rgba(255,255,255,0.97);line-height:1.15;margin:0;">Your Gap Report<br/>is Ready, {name}.</h1>
  </div>
  <div style="padding:32px;">
    <p style="color:rgba(255,255,255,0.65);line-height:1.7;margin-bottom:24px;">Based on your diagnostic inputs, your Authority Score is <strong style="color:#C9A84C;">{score}/16</strong> — classified as a <strong>{tier}</strong> infrastructure profile.</p>
    <a href="{report_url}" style="display:inline-block;padding:14px 28px;background:#C9A84C;color:#0A0A0B;font-weight:600;font-size:14px;text-decoration:none;border-radius:8px;margin-bottom:24px;">Download Full Gap Report</a>
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;"/>
    <p style="font-size:13px;color:rgba(255,255,255,0.4);">AXIS Media and Web Services · Mombasa, Kenya · <a href="https://axismediaws.com/initiate" style="color:#C9A84C;">Schedule Deep-Dive Audit →</a></p>
  </div>
</div>
</body></html>
"""


async def _notify_ceo_telegram(payload: AuditPayload, score: int) -> None:
    """Send STK push notification + Yes/No inline keyboard to CEO Telegram."""
    import httpx
    message = (
        f"🔥 *HIGH-AUTHORITY LEAD*\n\n"
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Phone: {payload.phone or 'N/A'}\n"
        f"Score: {score}/16\n"
        f"Source: {payload.source}\n\n"
        f"_Initiate M-Pesa STK Push?_"
    )
    keyboard = {
        "inline_keyboard": [[
            {"text": "✅ Yes — Push STK",  "callback_data": f"stk_yes:{payload.phone}:{payload.email}"},
            {"text": "❌ No",              "callback_data": f"stk_no:{payload.email}"},
        ]]
    }
    async with httpx.AsyncClient() as client:
        await client.post(
            f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage",
            json={
                "chat_id":      settings.TELEGRAM_CEO_CHAT_ID,
                "text":         message,
                "parse_mode":   "Markdown",
                "reply_markup": keyboard,
            },
            timeout=10,
        )


def _score_to_budget_tier(score: int) -> str:
    if score >= 12: return "High-Authority"
    if score >= 7:  return "Mid-Authority"
    return "Foundation"


# ── Routes ─────────────────────────────────────────────────────────────────

@router.post("", response_model=AuditResponse)
async def submit_audit(
    payload: AuditPayload,
    background_tasks: BackgroundTasks,
) -> AuditResponse:
    """
    Main audit submission endpoint.
    Receives diagnostic data → scores → stores → generates PDF → emails.
    """
    lead_id = str(uuid.uuid4())
    score   = payload.authority_score or calculate_authority_score(payload.responses or {})

    # Fire-and-forget: DB storage and report generation run async
    background_tasks.add_task(store_lead_and_audit, payload, lead_id, score)
    background_tasks.add_task(generate_and_send_report, payload, lead_id, score)

    return AuditResponse(
        success=True,
        lead_id=lead_id,
        authority_score=score,
        report_dispatched=True,
        message="Infrastructure Gap Report is being generated and will arrive within 5 minutes.",
    )
