# Production Security Setup Guide

Complete guide for implementing enterprise-grade security with rate limiting, spam detection, and RLS.

## 1. Install Additional Dependencies

```bash
pnpm add ua-parser-js
pnpm add -D @types/ua-parser-js
```

## 2. Run the Full Schema

Execute the complete schema from `supabase/schema.sql` in your Supabase SQL Editor.

## 3. Environment Variables

Add to `.env.local`:

```
# Rate Limiting
RATE_LIMIT_MAX_LEADS=3
RATE_LIMIT_MAX_INQUIRIES=5
RATE_LIMIT_WINDOW_MINUTES=60

# Security
ENABLE_SPAM_FILTER=true
SPAM_SCORE_THRESHOLD=80
```

## 4. Enhanced API Routes

Replace the simple API routes with production versions that include:

### Features

- **Rate Limiting**: Per-IP tracking with hourly windows
- **Spam Detection**: 
  - Disposable email detection
  - Pattern matching for spam content
  - Bot detection via User-Agent
  - Auto-scoring 0-100
- **Device Fingerprinting**: Parse browser, OS, device type
- **UTM Tracking**: Full attribution analytics
- **IP Blocking**: Automatic + manual blocklist
- **Audit Logging**: Complete change history

### Security Headers

Routes return rate limit headers:
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1704067200
```

## 5. Row Level Security (RLS)

Already configured in schema:

- **Public users**: Can only INSERT (via API)
- **Authenticated admins**: Full CRUD access
- **Service role**: Bypasses all RLS (for API routes)

## 6. Monitoring Views

Access these views in Supabase Dashboard:

- `lead_dashboard`: Filtered view excluding spam
- `conversion_funnel`: Aggregated pipeline metrics
- `daily_metrics`: Daily lead volume and quality

## 7. Manual IP Blocking

Block abusive IPs:

```sql
INSERT INTO ip_blocks (ip_address, reason, expires_at)
VALUES ('192.168.1.1', 'abuse', now() + interval '7 days');
```

## 8. Email Domain Blacklist

Add disposable email domains:

```sql
INSERT INTO email_blacklist (domain, reason)
VALUES ('tempmail.com', 'disposable');
```

## 9. Email Notifications (Optional)

Create Supabase Edge Function for Slack/email alerts:

```typescript
// supabase/functions/lead-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { record } = await req.json()
  
  // Send Slack notification
  await fetch('https://hooks.slack.com/...', {
    method: 'POST',
    body: JSON.stringify({
      text: `New lead: ${record.name} (${record.email}) - Score: ${record.score}`
    })
  })
  
  return new Response('OK')
})
```

Deploy:
```bash
supabase functions deploy lead-notification
```

## 10. GDPR Compliance

- Store IP addresses for security (legitimate interest)
- Auto-delete after 90 days:

```sql
-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  UPDATE leads 
  SET ip_address = null, user_agent = null
  WHERE created_at < now() - interval '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron (if enabled)
SELECT cron.schedule('gdpr-cleanup', '0 0 * * *', 'SELECT cleanup_old_data()');
```

## Complete Working Example

See `supabase/examples/production-api.ts` for full working API route with all security features.

## Troubleshooting

### Rate Limit Too Aggressive

Adjust in schema or env:
```sql
-- More lenient for testing
UPDATE rate_limits 
SET request_count = 0 
WHERE ip_address = 'your-ip';
```

### Legitimate Emails Marked as Spam

Whitelist domains:
```sql
-- Remove from blacklist
DELETE FROM email_blacklist WHERE domain = 'legit-domain.com';

-- Or adjust score threshold in code
```

### High Spam Volume

Enable stricter filtering:
```sql
-- Lower threshold
UPDATE leads 
SET spam_score = 100 
WHERE email LIKE '%temp%' 
AND created_at > now() - interval '1 hour';
```
