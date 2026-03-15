"""
AXIS Backend — Core Config, Database, and Utilities
"""

# ── core/config.py ─────────────────────────────────────────────────────────
# (This file serves as the combined core module for conciseness)

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    DEBUG: bool = False
    SECRET_KEY: str = "change-me-in-production"
    ALLOWED_ORIGINS: List[str] = ["https://axismediaws.com", "http://localhost:4321"]
    ALLOWED_HOSTS: List[str]   = ["axismediaws.com", "*.axismediaws.com", "localhost"]

    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str   # Service role — server-side only, never exposed to frontend

    # Resend (Email)
    RESEND_API_KEY: str
    RESEND_FROM: str = "AXIS Infrastructure <axis@axismediaws.com>"

    # Safaricom Daraja
    DARAJA_CONSUMER_KEY: str
    DARAJA_CONSUMER_SECRET: str
    DARAJA_SHORTCODE: str       # Business shortcode or till number
    DARAJA_PASSKEY: str
    DARAJA_CALLBACK_URL: str = "https://axismediaws.com/api/v1/daraja/callback"
    DARAJA_ENV: str = "production"   # "sandbox" | "production"

    # Telegram
    TELEGRAM_BOT_TOKEN: str
    TELEGRAM_CEO_CHAT_ID: str

    # PDF Generation
    PDF_STORAGE_BUCKET: str = "gap-reports"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
