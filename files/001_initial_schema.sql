-- ═══════════════════════════════════════════════════════════════════════
-- AXIS MEDIA AND WEB SERVICES — SUPABASE SCHEMA MIGRATION
-- Version: 001 | Region: af-south-1 (closest to Mombasa/Nairobi)
-- Run: supabase db push (or paste into Supabase SQL Editor)
-- ═══════════════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- For fuzzy text search on leads

-- ── ENUM TYPES ────────────────────────────────────────────────────────────

CREATE TYPE budget_tier_enum AS ENUM (
    'Foundation',
    'Mid-Authority',
    'High-Authority'
);

CREATE TYPE transaction_status_enum AS ENUM (
    'Pending',
    'Success',
    'Failed'
);

CREATE TYPE system_status_enum AS ENUM (
    'draft',
    'published',
    'archived'
);

-- ── TABLE: leads ──────────────────────────────────────────────────────────
-- Primary lead capture table. Authority score drives routing logic.

CREATE TABLE IF NOT EXISTS leads (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email               TEXT NOT NULL UNIQUE,
    full_name           TEXT NOT NULL,
    phone               TEXT,
    website             TEXT,
    authority_score     INTEGER NOT NULL DEFAULT 0
                        CHECK (authority_score >= 0 AND authority_score <= 16),
    budget_tier         budget_tier_enum GENERATED ALWAYS AS (
                            CASE
                                WHEN authority_score >= 12 THEN 'High-Authority'::budget_tier_enum
                                WHEN authority_score >= 7  THEN 'Mid-Authority'::budget_tier_enum
                                ELSE 'Foundation'::budget_tier_enum
                            END
                        ) STORED,
    source              TEXT DEFAULT 'homepage',   -- 'homepage' | 'initiate' | 'vault' | 'archive'
    audit_completed     BOOLEAN NOT NULL DEFAULT FALSE,
    nurture_sent        BOOLEAN NOT NULL DEFAULT FALSE,
    utm_ref             TEXT,                       -- Captures ?ref= param e.g. '404'
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_leads_email          ON leads (email);
CREATE INDEX idx_leads_authority_score ON leads (authority_score DESC);
CREATE INDEX idx_leads_created_at     ON leads (created_at DESC);
CREATE INDEX idx_leads_budget_tier    ON leads (budget_tier);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── TABLE: infrastructure_audits ─────────────────────────────────────────
-- Stores the detailed audit responses and generated report metadata.

CREATE TABLE IF NOT EXISTS infrastructure_audits (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id         UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    gap_analysis    JSONB NOT NULL DEFAULT '{}',
    budget_tier     budget_tier_enum NOT NULL DEFAULT 'Foundation',
    report_url      TEXT,                           -- Supabase Storage signed URL
    report_generated_at TIMESTAMPTZ,
    calendly_booked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audits_lead_id    ON infrastructure_audits (lead_id);
CREATE INDEX idx_audits_budget_tier ON infrastructure_audits (budget_tier);
CREATE INDEX idx_audits_gap_analysis ON infrastructure_audits USING GIN (gap_analysis);

-- ── TABLE: portfolio_systems ──────────────────────────────────────────────
-- The Systems Archive. Only 'published' records appear on /archive.
-- draft records are invisible until narrative is finalized (no "Coming Soon" allowed).

CREATE TABLE IF NOT EXISTS portfolio_systems (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug                TEXT NOT NULL UNIQUE,
    title               TEXT NOT NULL,
    client_name         TEXT NOT NULL,
    category            TEXT NOT NULL,
    gap_description     TEXT NOT NULL,
    narrative           TEXT NOT NULL,
    solid_vocabulary    TEXT[] NOT NULL DEFAULT '{}',
    tech_stack          TEXT[] NOT NULL DEFAULT '{}',
    outcome             TEXT,
    live_url            TEXT,
    og_image_url        TEXT,
    status              system_status_enum NOT NULL DEFAULT 'draft',
    year                SMALLINT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_portfolio_status   ON portfolio_systems (status);
CREATE INDEX idx_portfolio_category ON portfolio_systems (category);
CREATE INDEX idx_portfolio_slug     ON portfolio_systems (slug);

-- Full-text search on portfolio
CREATE INDEX idx_portfolio_fts ON portfolio_systems
    USING GIN (to_tsvector('english', title || ' ' || gap_description || ' ' || narrative));

CREATE TRIGGER portfolio_updated_at
    BEFORE UPDATE ON portfolio_systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── TABLE: transactions ───────────────────────────────────────────────────
-- M-Pesa Daraja payment records.

CREATE TABLE IF NOT EXISTS transactions (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checkout_request_id     TEXT NOT NULL,          -- Daraja CheckoutRequestID
    merchant_request_id     TEXT,
    amount                  INTEGER NOT NULL,
    status                  transaction_status_enum NOT NULL DEFAULT 'Pending',
    mpesa_receipt_number    TEXT,                   -- Populated on Success
    phone                   TEXT NOT NULL,
    lead_email              TEXT REFERENCES leads(email) ON DELETE SET NULL,
    description             TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CheckoutRequestID is the primary lookup key from Daraja callbacks
CREATE UNIQUE INDEX idx_transactions_checkout ON transactions (checkout_request_id);
CREATE INDEX idx_transactions_status          ON transactions (status);
CREATE INDEX idx_transactions_phone           ON transactions (phone);
CREATE INDEX idx_transactions_receipt         ON transactions (mpesa_receipt_number)
    WHERE mpesa_receipt_number IS NOT NULL;

CREATE TRIGGER transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── TABLE: vault_assets ───────────────────────────────────────────────────
-- Tracks which leads have accessed which vault resources.

CREATE TABLE IF NOT EXISTS vault_accesses (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_email  TEXT NOT NULL REFERENCES leads(email) ON DELETE CASCADE,
    asset_slug  TEXT NOT NULL,
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vault_lead  ON vault_accesses (lead_email);
CREATE INDEX idx_vault_asset ON vault_accesses (asset_slug);

-- ── TABLE: system_status ─────────────────────────────────────────────────
-- Live uptime data for /status page.

CREATE TABLE IF NOT EXISTS system_status (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    system_slug     TEXT NOT NULL UNIQUE,
    system_name     TEXT NOT NULL,
    live_url        TEXT NOT NULL,
    uptime_pct      NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    last_checked    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_operational  BOOLEAN NOT NULL DEFAULT TRUE,
    response_ms     INTEGER,
    weekly_pings    JSONB DEFAULT '[]'::JSONB   -- Array of {ts, ms, ok}
);

-- ── ROW-LEVEL SECURITY ────────────────────────────────────────────────────
-- Enable RLS on all tables. Service role bypasses all policies.

ALTER TABLE leads                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_systems     ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_accesses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_status         ENABLE ROW LEVEL SECURITY;

-- Public read policy: only published portfolio systems
CREATE POLICY "Public can read published portfolio"
    ON portfolio_systems FOR SELECT
    USING (status = 'published');

-- Public read policy: system status (for /status page)
CREATE POLICY "Public can read system status"
    ON system_status FOR SELECT
    USING (TRUE);

-- Service role has full access (handled via SUPABASE_SERVICE_KEY in backend)
-- No additional policies needed for service role.

-- ── SEED: Initial portfolio systems ──────────────────────────────────────

INSERT INTO portfolio_systems (slug, title, client_name, category, gap_description, narrative, solid_vocabulary, tech_stack, outcome, live_url, status, year)
VALUES
(
    'tuma-logistics',
    'Tuma Logistics',
    'Tuma Logistics Ltd',
    'Logistics',
    'Manual freight booking via WhatsApp — zero digital paper trail, zero lead capture.',
    'We reframed the company from "delivery service" to "Supply Chain Architecture." The vocabulary shift alone doubled inbound inquiry quality.',
    ARRAY['Supply Chain Architecture','Transit Intelligence','Freight Sovereignty'],
    ARRAY['Astro 5','FastAPI','Daraja API','Supabase','Cloudflare Workers'],
    'KES 840K automated in first 90 days',
    'https://tumalogistics.co.ke',
    'published',
    2024
),
(
    'msa-legal',
    'MSA Legal Partners',
    'MSA Legal Partners LLP',
    'Professional Services',
    'A static 2018 website with a generic contact form. High authority, zero digital presence multiplier.',
    'Repositioned from "law firm" to "Legal Infrastructure for Kenyan Founders." Built a full intake vetting system that qualifies leads before any human contact.',
    ARRAY['Legal Infrastructure','Founder Protection Systems','Contractual Architecture'],
    ARRAY['Next.js','Resend','Supabase','Calendly API'],
    '3.1× increase in qualified intake volume',
    'https://msalegalpartners.co.ke',
    'published',
    2024
),
(
    'nyumba-properties',
    'Nyumba Properties',
    'Nyumba Properties Ltd',
    'Real Estate',
    'Property listings on a competitor aggregator. No owned audience, no M-Pesa booking rails.',
    'Built an owned platform with Daraja-powered reservation deposits, GeoJSON property mapping, and automated WhatsApp notifications.',
    ARRAY['Property Reservation Architecture','Digital Land Registry','Tenant Acquisition Systems'],
    ARRAY['Astro 5','Daraja API','Mapbox GL','Supabase','Twilio'],
    'KES 2.1M in deposits processed in first quarter',
    'https://nyumbaproperties.co.ke',
    'published',
    2023
),
(
    'coast-agritech',
    'Coast Agritech',
    'Coast Agritech Solutions',
    'Agritech',
    'Farmer data scattered across Excel sheets. No CRM, no payment system, no content presence.',
    'Installed a sovereign farmer-data platform with M-Pesa bulk disbursement, yield tracking, and an authority content system.',
    ARRAY['Farmer Intelligence Platform','Agricultural Data Sovereignty','Yield Architecture'],
    ARRAY['React','FastAPI','M-Pesa B2C','PostgreSQL','CRON Workers'],
    '1,240 farmers onboarded, KES 4.8M disbursed',
    'https://coastagritech.co.ke',
    'published',
    2024
);

-- ── SEED: System status ───────────────────────────────────────────────────

INSERT INTO system_status (system_slug, system_name, live_url, uptime_pct, response_ms, is_operational)
VALUES
    ('tuma-logistics',   'Tuma Logistics',        'https://tumalogistics.co.ke',    99.97, 94,  TRUE),
    ('msa-legal',        'MSA Legal Partners',    'https://msalegalpartners.co.ke', 100.00, 71, TRUE),
    ('nyumba-properties','Nyumba Properties',     'https://nyumbaproperties.co.ke', 99.99, 88,  TRUE),
    ('coast-agritech',   'Coast Agritech',        'https://coastagritech.co.ke',    99.94, 112, TRUE),
    ('axis-core',        'AXIS Core Platform',    'https://axismediaws.com',        100.00, 42, TRUE);

-- ── VIEWS ─────────────────────────────────────────────────────────────────

-- High-authority leads view (for Telegram notification queries)
CREATE VIEW high_authority_leads AS
    SELECT l.id, l.email, l.full_name, l.phone, l.authority_score,
           l.created_at, a.budget_tier, a.report_url, a.calendly_booked
    FROM leads l
    LEFT JOIN infrastructure_audits a ON a.lead_id = l.id
    WHERE l.authority_score >= 12
    ORDER BY l.created_at DESC;

-- Conversion funnel summary view
CREATE VIEW conversion_funnel AS
    SELECT
        COUNT(*) FILTER (WHERE authority_score > 0)                   AS total_assessed,
        COUNT(*) FILTER (WHERE authority_score >= 7)                  AS mid_authority,
        COUNT(*) FILTER (WHERE authority_score >= 12)                 AS high_authority,
        COUNT(*) FILTER (WHERE id IN (
            SELECT DISTINCT lead_email::UUID FROM transactions WHERE status = 'Success'
        ))                                                             AS converted,
        ROUND(
            COUNT(*) FILTER (WHERE authority_score >= 12) * 100.0
            / NULLIF(COUNT(*) FILTER (WHERE authority_score > 0), 0), 1
        )                                                              AS high_authority_rate_pct
    FROM leads;
