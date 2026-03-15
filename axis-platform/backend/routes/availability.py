"""
AXIS Backend — /api/v1/availability
Manages client slot availability, bookings, and waitlist.
CEO can update slot counts via a single Supabase row — no code changes needed.
"""

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging
from datetime import datetime

from core.config import settings
from core.database import get_db

logger = logging.getLogger("axis.availability")
router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────────────

class BookingPayload(BaseModel):
    name: str
    email: EmailStr
    phone: str
    business: Optional[str] = None
    preferred_time: Optional[str] = None
    note: Optional[str] = None
    type: str = "booking"  # "booking" | "waitlist"


class AvailabilityResponse(BaseModel):
    slots_total: int
    slots_taken: int
    next_slots_total: int
    next_slots_taken: int
    month: str
    next_month: str


# ── Helpers ────────────────────────────────────────────────────────────────

async def notify_ceo_booking(payload: BookingPayload, slot_type: str) -> None:
    """Fire Telegram alert to CEO on every booking or waitlist entry."""
    import httpx
    emoji  = "🔥" if slot_type == "booking" else "⏳"
    label  = "SLOT BOOKING REQUEST" if slot_type == "booking" else "WAITLIST ENTRY"
    message = (
        f"{emoji} *{label}*\n\n"
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Phone: {payload.phone}\n"
        f"Business: {payload.business or 'N/A'}\n"
        f"Preferred Time: {payload.preferred_time or 'N/A'}\n"
        f"Note: {payload.note or '—'}\n\n"
        f"_Respond within 2 hours to confirm._"
    )
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage",
                json={
                    "chat_id":    settings.TELEGRAM_CEO_CHAT_ID,
                    "text":       message,
                    "parse_mode": "Markdown",
                },
                timeout=10,
            )
    except Exception as e:
        logger.error(f"Telegram notify failed: {e}")


async def store_booking(payload: BookingPayload, slot_type: str) -> None:
    """Store booking or waitlist entry in Supabase."""
    db = get_db()
    try:
        db.table("availability_bookings").insert({
            "name":           payload.name,
            "email":          payload.email,
            "phone":          payload.phone,
            "business":       payload.business,
            "preferred_time": payload.preferred_time,
            "note":           payload.note,
            "entry_type":     slot_type,
            "status":         "pending",
            "created_at":     datetime.utcnow().isoformat(),
        }).execute()
    except Exception as e:
        logger.error(f"DB store booking failed: {e}")


# ── Routes ─────────────────────────────────────────────────────────────────

@router.get("", response_model=AvailabilityResponse)
async def get_availability() -> AvailabilityResponse:
    """
    Returns current and next month slot counts.
    CEO updates slots_taken in Supabase directly — no redeploy needed.
    """
    db  = get_db()
    now = datetime.utcnow()

    # Current month key e.g. "2025-06"
    curr_key = now.strftime("%Y-%m")
    next_month = now.month + 1 if now.month < 12 else 1
    next_year  = now.year if now.month < 12 else now.year + 1
    next_key   = f"{next_year}-{next_month:02d}"

    try:
        curr = db.table("availability_slots").select("*").eq("month_key", curr_key).execute()
        nxt  = db.table("availability_slots").select("*").eq("month_key", next_key).execute()

        curr_data = curr.data[0] if curr.data else {"slots_total": 2, "slots_taken": 0}
        next_data = nxt.data[0]  if nxt.data  else {"slots_total": 2, "slots_taken": 0}

        return AvailabilityResponse(
            slots_total      = curr_data.get("slots_total", 2),
            slots_taken      = curr_data.get("slots_taken", 0),
            next_slots_total = next_data.get("slots_total", 2),
            next_slots_taken = next_data.get("slots_taken", 0),
            month            = now.strftime("%B %Y"),
            next_month       = f"{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][next_month-1]} {next_year}",
        )
    except Exception as e:
        logger.error(f"Availability fetch failed: {e}")
        # Safe fallback — show 1 slot open
        return AvailabilityResponse(
            slots_total=2, slots_taken=1,
            next_slots_total=2, next_slots_taken=0,
            month=now.strftime("%B %Y"),
            next_month="Next Month",
        )


@router.post("/book")
async def book_slot(
    payload: BookingPayload,
    background_tasks: BackgroundTasks,
) -> dict:
    """
    Records a slot booking request.
    CEO confirms manually via WhatsApp/email — then updates slots_taken in Supabase.
    """
    background_tasks.add_task(store_booking, payload, "booking")
    background_tasks.add_task(notify_ceo_booking, payload, "booking")
    logger.info(f"Booking request: {payload.email} | {payload.business}")
    return {"success": True, "message": "Booking request received. Confirmation within 2 hours."}


@router.post("/waitlist")
async def join_waitlist(
    payload: BookingPayload,
    background_tasks: BackgroundTasks,
) -> dict:
    """Records a waitlist entry and notifies CEO."""
    background_tasks.add_task(store_booking, payload, "waitlist")
    background_tasks.add_task(notify_ceo_booking, payload, "waitlist")
    logger.info(f"Waitlist entry: {payload.email} | {payload.business}")
    return {"success": True, "message": "Added to waitlist. You'll be notified when slots open."}
