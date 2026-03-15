"""
AXIS Backend — Supabase Database Client
"""

from supabase import create_client, Client
from core.config import settings
import logging

logger = logging.getLogger("axis.db")

_client: Client | None = None


async def init_db() -> None:
    global _client
    _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    logger.info("Supabase client initialized.")


def get_db() -> Client:
    if _client is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return _client
