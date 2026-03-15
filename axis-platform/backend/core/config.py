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
    SECRET_KEY: str = "p9X2mR7vW4bN1zQ8kL5jH3tG6fD9sA2yU4iO1pE7wS5xZ8cC3vB6nM9kL2jH4gF1dS"
    ALLOWED_ORIGINS: List[str] = ["https://axismediaws.com", "http://localhost:4321"]
    ALLOWED_HOSTS: List[str]   = ["axismediaws.com", "*.axismediaws.com", "localhost"]

    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str   # Service role — server-side only, never exposed to frontend

    # Resend (Email)
    RESEND_API_KEY: str
    RESEND_FROM: str = "AXIS Infrastructure <axis@axismediaws.com>"

    # Safaricom Daraja
    # Safaricom Daraja (Neutralized for now)
    DARAJA_CONSUMER_KEY: str = "placeholder"
    DARAJA_CONSUMER_SECRET: str = "placeholder"
    DARAJA_SHORTCODE: str = "placeholder"
    DARAJA_PASSKEY: str = "placeholder"
    DARAJA_CALLBACK_URL: str = "https://axismediaws.com/api/v1/daraja/callback"
    DARAJA_ENV: str = "sandbox"  # Defaulting to sandbox is safer for build

    # Telegram
    TELEGRAM_BOT_TOKEN: str
    TELEGRAM_CEO_CHAT_ID: str

    # PDF Generation
    PDF_STORAGE_BUCKET: str = "gap-reports"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
