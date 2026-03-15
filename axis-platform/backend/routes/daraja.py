"""
AXIS Backend — /api/v1/daraja
Safaricom Daraja API: STK Push initiation, payment callback, Telegram approval loop.
"""

from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import base64
import hashlib
import httpx
import logging
import uuid
from datetime import datetime

from core.config import settings
from core.database import get_db

logger = logging.getLogger("axis.daraja")
router = APIRouter()

DARAJA_BASE = {
    "sandbox":    "https://sandbox.safaricom.co.ke",
    "production": "https://api.safaricom.co.ke",
}[settings.DARAJA_ENV if hasattr(settings, "DARAJA_ENV") else "production"]


# ── Schemas ────────────────────────────────────────────────────────────────

class STKPushRequest(BaseModel):
    phone: str      # Format: 254712345678
    amount: int
    description: str
    lead_email: Optional[str] = None


class STKPushResponse(BaseModel):
    success: bool
    checkout_request_id: Optional[str] = None
    message: str


# ── Daraja Client ──────────────────────────────────────────────────────────

async def get_daraja_token() -> str:
    """Fetch OAuth2 token from Safaricom Daraja."""
    credentials = base64.b64encode(
        f"{settings.DARAJA_CONSUMER_KEY}:{settings.DARAJA_CONSUMER_SECRET}".encode()
    ).decode()

    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials",
            headers={"Authorization": f"Basic {credentials}"},
            timeout=15,
        )
        r.raise_for_status()
        return r.json()["access_token"]


def build_stk_password(timestamp: str) -> str:
    """STK push password = base64(shortcode + passkey + timestamp)."""
    raw = f"{settings.DARAJA_SHORTCODE}{settings.DARAJA_PASSKEY}{timestamp}"
    return base64.b64encode(raw.encode()).decode()


# ── Routes ─────────────────────────────────────────────────────────────────

@router.post("/initiate", response_model=STKPushResponse)
async def initiate_stk_push(payload: STKPushRequest) -> STKPushResponse:
    """
    Trigger M-Pesa STK Push to client phone.
    Called from /initiate page (Deep-Dive Audit pre-payment) and Telegram approval flow.
    """
    try:
        token     = await get_daraja_token()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password  = build_stk_password(timestamp)

        # Normalize phone: ensure 254 prefix
        phone = payload.phone.lstrip("+").lstrip("0")
        if not phone.startswith("254"):
            phone = f"254{phone[-9:]}"

        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{DARAJA_BASE}/mpesa/stkpush/v1/processrequest",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "BusinessShortCode": settings.DARAJA_SHORTCODE,
                    "Password":          password,
                    "Timestamp":         timestamp,
                    "TransactionType":   "CustomerPayBillOnline",
                    "Amount":            payload.amount,
                    "PartyA":            phone,
                    "PartyB":            settings.DARAJA_SHORTCODE,
                    "PhoneNumber":       phone,
                    "CallBackURL":       settings.DARAJA_CALLBACK_URL,
                    "AccountReference":  "AXIS-AUDIT",
                    "TransactionDesc":   payload.description[:13],  # Daraja 13-char limit
                },
                timeout=20,
            )

        data = r.json()
        if r.status_code == 200 and data.get("ResponseCode") == "0":
            checkout_id = data["CheckoutRequestID"]

            # Record pending transaction in Supabase
            db = get_db()
            db.table("transactions").insert({
                "id":                    str(uuid.uuid4()),
                "checkout_request_id":   checkout_id,
                "amount":                payload.amount,
                "status":                "Pending",
                "phone":                 phone,
                "lead_email":            payload.lead_email,
                "created_at":            datetime.utcnow().isoformat(),
            }).execute()

            logger.info(f"STK Push initiated: {checkout_id} | Phone: {phone}")
            return STKPushResponse(
                success=True,
                checkout_request_id=checkout_id,
                message="STK push sent. Customer prompted on phone.",
            )
        else:
            logger.error(f"Daraja error: {data}")
            raise HTTPException(status_code=502, detail="STK push failed. Daraja returned error.")

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Daraja timeout. Please retry.")
    except Exception as e:
        logger.error(f"STK push exception: {e}")
        raise HTTPException(status_code=500, detail="Internal error initiating payment.")


@router.post("/callback")
async def daraja_callback(request: Request, background_tasks: BackgroundTasks):
    """
    Secured webhook for Safaricom Daraja payment results.
    Updates transactions table and triggers Telegram notification.
    """
    body = await request.json()
    logger.info(f"Daraja callback received: {body}")

    try:
        stk_callback = body["Body"]["stkCallback"]
        checkout_id  = stk_callback["CheckoutRequestID"]
        result_code  = stk_callback["ResultCode"]
        result_desc  = stk_callback.get("ResultDesc", "")

        db = get_db()

        if result_code == 0:
            # Successful payment
            metadata_items = stk_callback.get("CallbackMetadata", {}).get("Item", [])
            meta = {item["Name"]: item.get("Value") for item in metadata_items}

            db.table("transactions").update({
                "status":            "Success",
                "mpesa_receipt_number": meta.get("MpesaReceiptNumber"),
                "amount":            meta.get("Amount"),
                "updated_at":        datetime.utcnow().isoformat(),
            }).eq("checkout_request_id", checkout_id).execute()

            logger.info(f"Payment confirmed: {meta.get('MpesaReceiptNumber')}")

            # Notify CEO via Telegram
            background_tasks.add_task(
                _notify_payment_success,
                checkout_id,
                meta.get("MpesaReceiptNumber", "N/A"),
                meta.get("Amount", 0),
                meta.get("PhoneNumber", ""),
            )
        else:
            db.table("transactions").update({
                "status":     "Failed",
                "updated_at": datetime.utcnow().isoformat(),
            }).eq("checkout_request_id", checkout_id).execute()
            logger.warning(f"Payment failed: {result_desc}")

    except KeyError as e:
        logger.error(f"Malformed Daraja callback: {e}")

    # Daraja expects a 200 even on our processing errors
    return {"ResultCode": 0, "ResultDesc": "Accepted"}


@router.post("/telegram-approval")
async def telegram_approval(request: Request):
    """
    Webhook for Telegram bot inline keyboard callbacks.
    When CEO taps [Yes], triggers STK push to lead's phone.
    """
    body = await request.json()
    callback = body.get("callback_query", {})
    data     = callback.get("data", "")
    chat_id  = callback.get("message", {}).get("chat", {}).get("id")

    if data.startswith("stk_yes:"):
        _, phone, email = data.split(":", 2)
        # Fire STK push
        await initiate_stk_push(STKPushRequest(
            phone=phone,
            amount=15000,
            description="AXIS Deep Audit",
            lead_email=email,
        ))
        msg = f"✅ STK Push sent to {phone}"
    elif data.startswith("stk_no:"):
        msg = "❌ Push declined."
    else:
        msg = "Unknown action."

    # Answer Telegram callback
    async with httpx.AsyncClient() as client:
        await client.post(
            f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/answerCallbackQuery",
            json={"callback_query_id": callback.get("id"), "text": msg},
        )
        await client.post(
            f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage",
            json={"chat_id": chat_id, "text": msg},
        )

    return {"ok": True}


async def _notify_payment_success(
    checkout_id: str, receipt: str, amount: int, phone: str
) -> None:
    async with httpx.AsyncClient() as client:
        await client.post(
            f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage",
            json={
                "chat_id":    settings.TELEGRAM_CEO_CHAT_ID,
                "text":       f"💰 *Payment Confirmed*\n\nReceipt: `{receipt}`\nAmount: KES {amount}\nPhone: {phone}\nCheckout: `{checkout_id}`",
                "parse_mode": "Markdown",
            },
        )
