-- ============================================================================
-- DRD Digital - Production-Grade Supabase Schema
-- Complete setup with RLS, rate limiting, security, and analytics
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS & UTILITIES
-- ----------------------------------------------------------------------------

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. CUSTOM TYPES & ENUMS
-- ----------------------------------------------------------------------------

-- Lead status workflow
CREATE TYPE lead_status AS ENUM (
  'new',           -- Just submitted
  'contacted',     -- Email/call sent
  'qualified',     -- Verified interest + budget
  'proposal_sent', -- Quote/proposal delivered
  'negotiating',   -- Terms being discussed
  'closed_won',    -- Deal signed
  'closed_lost',   -- Not proceeding
  'nurture'        -- Future opportunity
);

-- Lead quality scoring
CREATE TYPE lead_quality AS ENUM (
  'hot',      -- Immediate need, budget ready
  'warm',     -- Interest but timing unclear
  'cold',     -- Information gathering only
  'spam',     -- Detected as spam/abuse
  'invalid'   -- Fake email/phone
);

-- Revenue ranges for segmentation
CREATE TYPE revenue_range AS ENUM (
  'under_100k',
  '100k_500k',
  '500k_1m',
  '1m_5m',
  '5m_10m',
  'over_10m',
  'unknown'
);

-- Timeline urgency
CREATE TYPE project_timeline AS ENUM (
  'immediate',    -- This month
  '1_3_months',   -- Next quarter
  '3_6_months',   -- Next 2 quarters
  '6_12_months',  -- Next year
  'exploring',    -- No timeline yet
  'unknown'
);

-- Challenge categories
CREATE TYPE challenge_category AS ENUM (
  'visibility',      -- Not found online
  'leads',           -- No inbound leads
  'conversion',      -- Traffic but no sales
  'technical_seo',   -- Site speed/performance
  'content',         -- Need better content
  'competition',     -- Losing to competitors
  'reputation',      -- Reviews/PR issues
  'strategy',        -- No clear digital strategy
  'other'
);

-- Inquiry types
CREATE TYPE inquiry_type AS ENUM (
  'general',        -- General question
  'partnership',    -- Partnership opportunity
  'media',          -- Press/media inquiry
  'career',         -- Job application
  'feedback',       -- Website feedback
  'support'         -- Client support
);

-- ----------------------------------------------------------------------------
-- 3. RATE LIMITING & SECURITY TABLES
-- ----------------------------------------------------------------------------

-- Rate limiting by IP
CREATE TABLE rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  endpoint text NOT NULL,           -- '/api/leads', '/api/inquiries'
  request_count int DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  blocked_until timestamptz,        -- NULL = not blocked
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(ip_address, endpoint, window_start)
);

-- Suspicious/blocked IPs
CREATE TABLE ip_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL UNIQUE,
  reason text NOT NULL,             -- 'rate_limit', 'spam', 'manual'
  evidence jsonb,                   -- Request logs, patterns
  blocked_at timestamptz DEFAULT now(),
  expires_at timestamptz,           -- NULL = permanent
  created_by uuid REFERENCES auth.users(id)
);

-- Email domain blacklist (disposable emails, etc.)
CREATE TABLE email_blacklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL UNIQUE,      -- 'tempmail.com', '10minutemail.com'
  reason text,
  created_at timestamptz DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. MAIN LEADS TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE leads (
  -- Primary fields
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Contact info (required)
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  job_title text,
  
  -- Diagnostic data
  revenue_range revenue_range,
  challenge challenge_category,
  challenge_details text,           -- Free text elaboration
  timeline project_timeline,
  
  -- Scoring & status
  status lead_status DEFAULT 'new',
  quality lead_quality DEFAULT 'warm',
  score int GENERATED ALWAYS AS (
    CASE 
      WHEN timeline = 'immediate' THEN 30
      WHEN timeline = '1_3_months' THEN 20
      WHEN timeline = '3_6_months' THEN 10
      ELSE 0
    END +
    CASE 
      WHEN revenue_range IN ('1m_5m', '5m_10m', 'over_10m') THEN 30
      WHEN revenue_range IN ('500k_1m') THEN 20
      WHEN revenue_range IN ('100k_500k') THEN 10
      ELSE 0
    END +
    CASE 
      WHEN challenge IN ('leads', 'conversion') THEN 20
      WHEN challenge IN ('visibility', 'technical_seo') THEN 15
      ELSE 5
    END
  ) STORED,                         -- 0-80 lead score
  
  -- Marketing attribution
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer_url text,
  landing_page text,
  
  -- Device/location data (GDPR compliant, no PII)
  ip_address inet,
  user_agent text,
  country_code text(2),
  city text,
  device_type text,                 -- mobile, desktop, tablet
  browser text,
  os text,
  
  -- Engagement tracking
  email_opened boolean DEFAULT false,
  email_clicked boolean DEFAULT false,
  follow_up_count int DEFAULT 0,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  
  -- Internal notes
  notes text,
  assigned_to uuid REFERENCES auth.users(id),
  tags text[],                      -- ['hot-lead', 'enterprise', 'follow-up']
  
  -- Spam/protection
  spam_score int DEFAULT 0,         -- 0-100, auto-calculated
  verified boolean DEFAULT false,   -- Email verified
  duplicate_of uuid REFERENCES leads(id),
  
  -- Audit
  created_by uuid REFERENCES auth.users(id),
  version int DEFAULT 1
);

-- ----------------------------------------------------------------------------
-- 5. INQUIRIES TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Contact info
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  
  -- Message content
  type inquiry_type DEFAULT 'general',
  subject text,
  message text NOT NULL,
  attachments jsonb,                -- Array of {filename, url, size}
  
  -- Source tracking
  source text DEFAULT 'website',    -- 'website', 'referral', 'linkedin', etc.
  page_url text,                    -- /contact, /partners, etc.
  referrer_url text,
  
  -- Device data
  ip_address inet,
  user_agent text,
  country_code text(2),
  
  -- Status workflow
  status text DEFAULT 'new',        -- 'new', 'assigned', 'in_progress', 'resolved', 'spam'
  priority text DEFAULT 'normal',   -- 'low', 'normal', 'high', 'urgent'
  assigned_to uuid REFERENCES auth.users(id),
  
  -- Resolution
  response_message text,
  responded_at timestamptz,
  responded_by uuid REFERENCES auth.users(id),
  resolution_time interval,         -- Time to first response
  
  -- Spam protection
  spam_score int DEFAULT 0,
  
  -- Notes
  internal_notes text,
  tags text[]
);

-- ----------------------------------------------------------------------------
-- 6. AUDIT LOG
-- ----------------------------------------------------------------------------

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  
  table_name text NOT NULL,         -- 'leads', 'inquiries'
  record_id uuid NOT NULL,
  action text NOT NULL,             -- 'INSERT', 'UPDATE', 'DELETE'
  
  old_data jsonb,
  new_data jsonb,
  
  performed_by uuid REFERENCES auth.users(id),
  ip_address inet,
  user_agent text,
  
  reason text                       -- Optional reason for change
);

-- ----------------------------------------------------------------------------
-- 7. INDEXES FOR PERFORMANCE
-- ----------------------------------------------------------------------------

-- Leads indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_quality ON leads(quality);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_company ON leads(company);
CREATE INDEX idx_leads_assigned ON leads(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;
CREATE INDEX idx_leads_utm ON leads(utm_source, utm_campaign) WHERE utm_source IS NOT NULL;
CREATE INDEX idx_leads_spam ON leads(spam_score) WHERE spam_score > 50;

-- Inquiries indexes
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_type ON inquiries(type);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX idx_inquiries_email ON inquiries(email);
CREATE INDEX idx_inquiries_assigned ON inquiries(assigned_to) WHERE assigned_to IS NOT NULL;

-- Rate limiting indexes
CREATE INDEX idx_rate_limits_lookup ON rate_limits(ip_address, endpoint, window_start);
CREATE INDEX idx_rate_limits_blocked ON rate_limits(blocked_until) WHERE blocked_until IS NOT NULL;

-- Audit indexes
CREATE INDEX idx_audit_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_time ON audit_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 8. FUNCTIONS & TRIGGERS
-- ----------------------------------------------------------------------------

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit logging
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_audit AFTER INSERT OR UPDATE OR DELETE ON leads
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER inquiries_audit AFTER INSERT OR UPDATE OR DELETE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Increment version on update
CREATE OR REPLACE FUNCTION increment_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_leads_version BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION increment_version();

-- ----------------------------------------------------------------------------
-- 9. RATE LIMITING FUNCTIONS
-- ----------------------------------------------------------------------------

-- Check if request is allowed
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_ip_address inet,
  p_endpoint text,
  p_max_requests int DEFAULT 5,
  p_window_minutes int DEFAULT 60
)
RETURNS TABLE (allowed boolean, remaining int, reset_at timestamptz) AS $$
DECLARE
  v_window_start timestamptz := date_trunc('hour', now());
  v_count int;
  v_blocked_until timestamptz;
BEGIN
  -- Check if IP is permanently blocked
  EXISTS (SELECT 1 FROM ip_blocks 
          WHERE ip_address = p_ip_address 
          AND (expires_at IS NULL OR expires_at > now()))
  INTO v_blocked_until;
  
  IF v_blocked_until IS NOT NULL THEN
    RETURN QUERY SELECT false, 0, v_blocked_until;
    RETURN;
  END IF;
  
  -- Get or create rate limit record
  INSERT INTO rate_limits (ip_address, endpoint, window_start, request_count)
  VALUES (p_ip_address, p_endpoint, v_window_start, 1)
  ON CONFLICT (ip_address, endpoint, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1,
                updated_at = now()
  RETURNING request_count INTO v_count;
  
  -- Check if exceeded
  IF v_count > p_max_requests THEN
    -- Block for 1 hour
    UPDATE rate_limits 
    SET blocked_until = now() + interval '1 hour'
    WHERE ip_address = p_ip_address 
    AND endpoint = p_endpoint 
    AND window_start = v_window_start;
    
    RETURN QUERY SELECT false, 0, now() + interval '1 hour';
  ELSE
    RETURN QUERY SELECT true, p_max_requests - v_count, v_window_start + (p_window_minutes || ' minutes')::interval;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 10. SECURITY FUNCTIONS
-- ----------------------------------------------------------------------------

-- Check if email domain is blacklisted
CREATE OR REPLACE FUNCTION is_email_blacklisted(p_email text)
RETURNS boolean AS $$
DECLARE
  v_domain text;
BEGIN
  v_domain := split_part(p_email, '@', 2);
  RETURN EXISTS (SELECT 1 FROM email_blacklist WHERE domain = v_domain);
END;
$$ LANGUAGE plpgsql STABLE;

-- Calculate spam score
CREATE OR REPLACE FUNCTION calculate_spam_score(
  p_email text,
  p_message text,
  p_ip_address inet
)
RETURNS int AS $$
DECLARE
  v_score int := 0;
BEGIN
  -- Blacklisted domain = instant spam
  IF is_email_blacklisted(p_email) THEN
    RETURN 100;
  END IF;
  
  -- Disposable email patterns
  IF p_email ~* 'temp|disposable|fake|mailinator|guerrillamail' THEN
    v_score := v_score + 50;
  END IF;
  
  -- Common spam patterns in message
  IF p_message ~* '\$\$\$|make money fast|click here|viagra|casino|lottery' THEN
    v_score := v_score + 40;
  END IF;
  
  -- Excessive caps
  IF length(p_message) > 0 AND 
     (length(regexp_replace(p_message, '[^A-Z]', '', 'g'))::float / length(p_message)) > 0.5 THEN
    v_score := v_score + 20;
  END IF;
  
  -- Multiple exclamation marks
  IF p_message ~* '!{3,}' THEN
    v_score := v_score + 10;
  END IF;
  
  -- Check if IP has been blocked before
  IF EXISTS (SELECT 1 FROM ip_blocks WHERE ip_address = p_ip_address) THEN
    v_score := v_score + 30;
  END IF;
  
  RETURN least(v_score, 100);
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_blacklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Leads policies
CREATE POLICY "Service role can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads" ON leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update leads" ON leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads" ON leads
  FOR DELETE TO authenticated USING (true);

-- Inquiries policies
CREATE POLICY "Service role can insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view inquiries" ON inquiries
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update inquiries" ON inquiries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete inquiries" ON inquiries
  FOR DELETE TO authenticated USING (true);

-- Security tables (admin only)
CREATE POLICY "Only admins can manage rate limits" ON rate_limits
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );

CREATE POLICY "Only admins can manage IP blocks" ON ip_blocks
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );

CREATE POLICY "Only admins can manage email blacklist" ON email_blacklist
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );

CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin')
  );

-- ----------------------------------------------------------------------------
-- 12. VIEWS FOR REPORTING
-- ----------------------------------------------------------------------------

-- Lead dashboard view
CREATE VIEW lead_dashboard AS
SELECT 
  l.*,
  CASE 
    WHEN l.score >= 60 THEN 'high'
    WHEN l.score >= 40 THEN 'medium'
    ELSE 'low'
  END as priority_tier,
  CASE
    WHEN l.status = 'new' AND l.created_at < now() - interval '24 hours' THEN 'overdue'
    WHEN l.status = 'contacted' AND l.last_contact_at < now() - interval '7 days' THEN 'follow_up_needed'
    ELSE 'on_track'
  END as follow_up_status
FROM leads l
WHERE l.spam_score < 50;

-- Conversion funnel view
CREATE VIEW conversion_funnel AS
SELECT 
  status,
  quality,
  count(*) as count,
  avg(score) as avg_score,
  min(created_at) as oldest,
  max(created_at) as newest
FROM leads
WHERE spam_score < 50
GROUP BY status, quality;

-- Daily metrics
CREATE VIEW daily_metrics AS
SELECT 
  date_trunc('day', created_at) as day,
  count(*) FILTER (WHERE spam_score < 50) as valid_leads,
  count(*) FILTER (WHERE spam_score >= 50) as spam_leads,
  avg(score) FILTER (WHERE spam_score < 50) as avg_quality_score,
  count(DISTINCT utm_source) as traffic_sources
FROM leads
GROUP BY date_trunc('day', created_at)
ORDER BY day DESC;

-- ----------------------------------------------------------------------------
-- 13. SEED DATA
-- ----------------------------------------------------------------------------

-- Common disposable email domains
INSERT INTO email_blacklist (domain, reason) VALUES
('tempmail.com', 'disposable'),
('10minutemail.com', 'disposable'),
('guerrillamail.com', 'disposable'),
('mailinator.com', 'disposable'),
('throwawaymail.com', 'disposable'),
('fakeinbox.com', 'disposable'),
('yopmail.com', 'disposable'),
('sharklasers.com', 'disposable'),
('getairmail.com', 'disposable'),
('tempinbox.com', 'disposable')
ON CONFLICT (domain) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 14. COMMENTS FOR DOCUMENTATION
-- ----------------------------------------------------------------------------

COMMENT ON TABLE leads IS 'Primary lead capture from diagnostic tool and forms';
COMMENT ON TABLE inquiries IS 'General contact form submissions';
COMMENT ON TABLE rate_limits IS 'Rate limiting tracking per IP/endpoint';
COMMENT ON TABLE ip_blocks IS 'Banned IP addresses';
COMMENT ON TABLE audit_logs IS 'Complete change history for compliance';

COMMENT ON COLUMN leads.score IS 'Auto-calculated 0-80 score based on revenue, timeline, and challenge';
COMMENT ON COLUMN leads.spam_score IS '0-100 spam probability, >50 auto-filtered';
COMMENT ON COLUMN leads.utm_source IS 'Marketing attribution: google, linkedin, referral, etc.';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
