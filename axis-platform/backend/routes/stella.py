"""
AXIS Backend — /api/v1/stella/pulse
Fetches Solid vocabulary & research snippets for dynamic content blocks.
"""

from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from core.config import settings
from core.database import get_db
import logging

logger = logging.getLogger("axis.stella")
router = APIRouter()


def _verify_internal_key(x_axis_key: Optional[str] = Header(None)) -> None:
    """Simple internal key check for the pulse endpoint."""
    if x_axis_key != settings.SECRET_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.get("/pulse", dependencies=[Depends(_verify_internal_key)])
async def stella_pulse():
    """
    Returns latest Solid vocabulary and research snippets from the private DB.
    Used to hydrate the site's dynamic content blocks.
    """
    db = get_db()

    # Fetch latest portfolio systems with vocabulary
    systems = db.table("portfolio_systems") \
        .select("title, solid_vocabulary, gap_description, tech_stack") \
        .order("created_at", desc=True) \
        .limit(10) \
        .execute()

    # Fetch aggregated vocabulary for the vocabulary shift table
    vocab_entries = []
    for s in (systems.data or []):
        vocab_entries.extend(s.get("solid_vocabulary", []))

    # Unique vocabulary, most recent first
    unique_vocab = list(dict.fromkeys(vocab_entries))

    return {
        "status": "operational",
        "systems": systems.data or [],
        "vocabulary_pool": unique_vocab[:24],
        "node": "AXIS-STELLA-V2.1",
    }
