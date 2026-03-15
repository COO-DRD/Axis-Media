# AXIS Media and Web Services — Platform Repository

**Sovereign Digital Infrastructure** · Mombasa, Kenya

---

## Architecture Overview

```
axis-platform/
├── src/                          # Astro 5 frontend (static output)
│   ├── pages/
│   │   ├── index.astro           # / — The Diagnostic (Clinical Assessment)
│   │   ├── solutions.astro       # /solutions — The Methodology
│   │   ├── archive.astro         # /archive — Systems Archive
│   │   ├── initiate.astro        # /initiate — Vetting Intake + M-Pesa
│   │   ├── status.astro          # /status — Infrastructure Monitor
│   │   ├── vault.astro           # /vault — Gated Resource Repository
│   │   └── 404.astro             # 404 → /?ref=404 redirect
│   ├── layouts/
│   │   └── BaseLayout.astro      # Global layout: nav, eco-mode, dock, footer
│   └── styles/
│       └── global.css            # Tactile Morphism design system
│
├── backend/                      # FastAPI (Python 3.12)
│   ├── main.py                   # App entry point + router registration
│   ├── core/
│   │   ├── config.py             # Pydantic settings (env vars)
│   │   └── database.py           # Supabase client
│   ├── routes/
│   │   ├── audit.py              # POST /api/v1/audit
│   │   ├── daraja.py             # POST /api/v1/daraja/initiate + /callback
│   │   ├── stella.py             # GET  /api/v1/stella/pulse
│   │   └── vault.py              # POST /api/v1/vault/access
│   └── workers/
│       └── workers.py            # Celery: nurture, image optimization, uptime
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Full PostgreSQL schema + seed data
│
├── scripts/
│   ├── cloudflare-worker.js      # Edge cache + 404 intercept + security headers
│   └── linkcheck.js              # Pre-flight dead link checker
│
└── .github/
    └── workflows/
        └── deploy.yml            # CI/CD: test → build → link check → deploy
```

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 22 | Astro frontend |
| Python | ≥ 3.12 | FastAPI backend |
| Redis | ≥ 7 | Celery broker |
| Supabase CLI | latest | DB migrations |
| Wrangler CLI | latest | Cloudflare Worker deploy |

---

## Quick Start

### 1. Frontend

```bash
# Install dependencies
npm install

# Set env vars
cp .env.example .env
# Fill PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON in .env

# Development
npm run dev          # → http://localhost:4321

# Production build + pre-flight check
npm run build
npm run check:links  # Must exit 0 before deploy
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set env vars
cp ../.env.example .env
# Fill all values (Supabase, Daraja, Resend, Telegram)

# Run FastAPI
uvicorn main:app --reload --port 8000
```

### 3. Celery Workers

```bash
# Terminal 1: Redis (Docker)
docker run -p 6379:6379 redis:7-alpine

# Terminal 2: Celery worker
cd backend
celery -A workers.workers worker --loglevel=info

# Terminal 3: Celery beat (CRON scheduler)
cd backend
celery -A workers.workers beat --loglevel=info
```

### 4. Database

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push
```

### 5. Cloudflare Worker (Production)

```bash
# Install Wrangler
npm install -g wrangler

# Authenticate
wrangler login

# Deploy
wrangler deploy scripts/cloudflare-worker.js --name axis-edge
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill all values. See inline comments for where to obtain each credential.

**Critical secrets (never commit to git):**
- `SUPABASE_SERVICE_KEY` — Server-side only, bypasses RLS
- `DARAJA_CONSUMER_SECRET` + `DARAJA_PASSKEY`
- `TELEGRAM_BOT_TOKEN`
- `RESEND_API_KEY`

---

## The "No Dead Link" Guarantee

The pre-flight checker (`npm run check:links`) enforces:

1. **No empty hrefs** — `href=""` or `href="#"` on any live page
2. **No placeholder text** — "Coming Soon", "Lorem Ipsum", "TBD"
3. **All internal links resolve** — every `/path` must have a matching file in `/dist`
4. **All assets exist** — every `src="/..."` must have a matching file in `/dist`

CI/CD will fail at the link check step if any violation is detected.

Draft portfolio pieces are kept in Supabase with `status = 'draft'` and are never rendered to the frontend until the narrative is finalized.

---

## M-Pesa Integration Flow

```
User (initiate page)
  → Enters 254XXXXXXXXX phone number
  → Clicks "Send STK Push"
  → POST /api/v1/daraja/initiate
      → Daraja OAuth token
      → STK Push request to Safaricom
      → Transaction saved as "Pending" in Supabase
  ← Safaricom pushes USSD prompt to phone
  → User enters M-Pesa PIN
  ← Safaricom sends result to /api/v1/daraja/callback
      → Transaction updated to "Success" / "Failed"
      → Telegram notification sent to CEO
```

---

## Lead Scoring Logic

| Authority Score | Tier | Route |
|----------------|------|-------|
| 12–16 | High-Authority | Calendly widget hydrates + M-Pesa payment option |
| 7–11  | Mid-Authority  | Nurture sequence via Resend (48h delay) |
| 1–6   | Foundation     | Redirected to AXIS Manifesto gift |

Scoring is calculated in `backend/routes/audit.py → calculate_authority_score()`.

---

## Deployment Targets

| Component | Platform | Notes |
|-----------|----------|-------|
| Frontend | Cloudflare Pages | Auto-deploys from `main` branch |
| Edge Worker | Cloudflare Workers | 404 interception + cache control |
| Backend API | Render / Railway | FastAPI with Uvicorn |
| Celery Workers | Render Background Workers | Or Railway worker dyno |
| Redis | Upstash Redis | Serverless, free tier |
| Database | Supabase | PostgreSQL + Storage + RLS |

---

## Built by AXIS. Run by infrastructure. Operated in Mombasa, Kenya.
