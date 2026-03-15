"""
AXIS Backend — /api/v1/vault
Gated asset repository. Email capture before serving signed download URLs.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
from core.config import settings
from core.database import get_db
import logging
import uuid
from datetime import datetime, timedelta

logger = logging.getLogger("axis.vault")
router = APIRouter()


class VaultAccessRequest(BaseModel):
    email: EmailStr
    name: str
    asset: str   # e.g. "axis-manifesto"


@router.post("/access")
async def vault_access(payload: VaultAccessRequest, background_tasks: BackgroundTasks):
    """
    1. Capture email into leads table.
    2. Return a time-limited signed URL to the requested asset.
    """
    db = get_db()

    # Upsert lead
    db.table("leads").upsert({
        "id":           str(uuid.uuid4()),
        "email":        payload.email,
        "full_name":    payload.name,
        "source":       "vault",
        "created_at":   datetime.utcnow().isoformat(),
    }, on_conflict="email").execute()

    # Generate signed URL from Supabase Storage (expires in 1 hour)
    asset_path = f"vault/{payload.asset}.pdf"
    signed = db.storage.from_(settings.PDF_STORAGE_BUCKET).create_signed_url(
        asset_path, expires_in=3600
    )

    if not signed or not signed.get("signedURL"):
        raise HTTPException(status_code=404, detail="Asset not found in vault.")

    # Schedule 48-hour generosity nurture if lead hasn't completed audit
    background_tasks.add_task(_schedule_generosity_nurture, payload.email, payload.name)

    logger.info(f"Vault access granted: {payload.email} → {payload.asset}")
    return {"signed_url": signed["signedURL"], "expires_in": 3600}


async def _schedule_generosity_nurture(email: str, name: str) -> None:
    """
    Enqueues a 48-hour follow-up email via Celery/Redis.
    If the lead hasn't initiated an audit within 48h, send a Solid narrative asset.
    In production this would publish to a Celery queue. Here we log the intent.
    """
    logger.info(f"[Generosity Nurture] Queued 48h follow-up for {email}")
    # Production: celery_app.send_task('workers.nurture.send_followup', args=[email, name], countdown=172800)
