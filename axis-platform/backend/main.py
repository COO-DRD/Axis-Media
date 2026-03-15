"""
AXIS Media and Web Services — FastAPI Backend
The Nervous System: audit processing, Daraja M-Pesa, Stella pulse, lead management.
"""

from fastapi import FastAPI, Request, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import logging

from core.config import settings
from core.database import init_db
from routes import audit, daraja, stella, vault, availability

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("axis")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown logic."""
    logger.info("AXIS Backend initializing…")
    await init_db()
    logger.info("Supabase connection established.")
    yield
    logger.info("AXIS Backend shutting down.")


app = FastAPI(
    title="AXIS Media Backend",
    description="Sovereign Infrastructure API — AXIS Media and Web Services, Mombasa KE",
    version="2.1.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url=None,
    lifespan=lifespan,
)

# ── Middleware ─────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.hosts_list,
)

# ── Routers ────────────────────────────────────────────────────────────────
app.include_router(audit.router,        prefix="/api/v1/audit",        tags=["Audit"])
app.include_router(daraja.router,       prefix="/api/v1/daraja",       tags=["M-Pesa Daraja"])
app.include_router(stella.router,       prefix="/api/v1/stella",       tags=["Stella Engine"])
app.include_router(vault.router,        prefix="/api/v1/vault",        tags=["Vault"])
app.include_router(availability.router, prefix="/api/v1/availability", tags=["Availability"])

# ── Health ─────────────────────────────────────────────────────────────────
@app.get("/api/v1/health", tags=["System"])
async def health():
    return {"status": "operational", "node": "AXIS-BACKEND-V2", "region": "MSA-KE"}
