/**
 * AXIS Media — Cloudflare Worker
 * Edge Infrastructure Layer: Mombasa CDN node
 *
 * Responsibilities:
 * 1. Cache static pages at the edge with controlled TTLs
 * 2. Intercept 404s and redirect → /?ref=404
 * 3. Ensure /api/* routes always bypass cache
 * 4. Add security headers on all responses
 * 5. Inject geo-awareness for Kenyan market optimizations
 */

const CACHE_RULES = {
  "/":           { ttl: 86400,  swr: 3600  },   // Homepage: 24h cache, 1h stale-while-revalidate
  "/solutions":  { ttl: 43200,  swr: 1800  },   // 12h
  "/archive":    { ttl: 21600,  swr: 900   },   // 6h — content updates more frequently
  "/initiate":   { ttl: 0,      swr: 0     },   // Never cache — personalized
  "/status":     { ttl: 300,    swr: 60    },   // 5 min — near-real-time
  "/vault":      { ttl: 0,      swr: 0     },   // Never cache — gated content
};

const API_BYPASS_PATTERN = /^\/api\//;
const STATIC_ASSET_PATTERN = /\.(webp|jpg|png|svg|ico|woff2|woff|css|js|txt|xml)$/i;

// Security headers applied to every response
const SECURITY_HEADERS = {
  "X-Content-Type-Options":        "nosniff",
  "X-Frame-Options":               "SAMEORIGIN",
  "X-XSS-Protection":              "1; mode=block",
  "Referrer-Policy":               "strict-origin-when-cross-origin",
  "Permissions-Policy":            "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security":     "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://storage.axismediaws.com",
    "connect-src 'self' https://api.axismediaws.com https://axismediaws.supabase.co",
    "frame-src https://calendly.com",
  ].join("; "),
};


/**
 * Main Cloudflare Worker entry point
 */
export default {
  async fetch(request, env, ctx) {
    const url     = new URL(request.url);
    const path    = url.pathname;
    const country = request.cf?.country || "KE";

    // ── 1. API Routes: Always bypass cache ────────────────────────────────
    if (API_BYPASS_PATTERN.test(path)) {
      const response = await fetch(request);
      return addSecurityHeaders(response);
    }

    // ── 2. Static Assets: Long cache, immutable ───────────────────────────
    if (STATIC_ASSET_PATTERN.test(path)) {
      const cacheKey = new Request(request.url, request);
      const cache    = caches.default;
      let cached     = await cache.match(cacheKey);

      if (cached) return cached;

      const origin = await fetch(request);
      const response = new Response(origin.body, origin);
      response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return addSecurityHeaders(response);
    }

    // ── 3. Page Routes: TTL-controlled edge cache ─────────────────────────
    const cacheRule = getCacheRule(path);
    const cacheKey  = new Request(request.url, request);
    const cache     = caches.default;

    if (cacheRule.ttl > 0) {
      const cached = await cache.match(cacheKey);
      if (cached) {
        const res = new Response(cached.body, cached);
        res.headers.set("X-Cache-Status", "HIT");
        res.headers.set("X-Edge-Node", "MSA-KE");
        return addSecurityHeaders(res);
      }
    }

    // ── 4. Fetch from origin ──────────────────────────────────────────────
    let originResponse;
    try {
      originResponse = await fetch(request, {
        cf: {
          cacheTtl:              cacheRule.ttl,
          cacheEverything:       cacheRule.ttl > 0,
          cacheKey:              request.url,
        }
      });
    } catch (err) {
      // Origin unreachable: serve stale or error
      return new Response("Service temporarily unavailable. Please retry.", {
        status: 503,
        headers: { "Retry-After": "30", "Content-Type": "text/plain" },
      });
    }

    // ── 5. 404 Interception ───────────────────────────────────────────────
    if (originResponse.status === 404) {
      const redirectUrl = new URL("https://axismediaws.com/");
      redirectUrl.searchParams.set("ref", "404");
      redirectUrl.searchParams.set("from", path);
      return Response.redirect(redirectUrl.toString(), 301);
    }

    // ── 6. Low-bandwidth hint for Kenyan 2G/3G connections ───────────────
    const ect = request.headers.get("ECT") || request.cf?.httpProtocol;
    const saveData = request.headers.get("Save-Data") === "on";

    const finalResponse = new Response(originResponse.body, originResponse);
    finalResponse.headers.set("X-Cache-Status", "MISS");
    finalResponse.headers.set("X-Edge-Node", `MSA-KE-${country}`);
    finalResponse.headers.set("Vary", "Accept-Encoding, Save-Data");

    if (saveData) {
      // Signal frontend to activate eco mode via cookie
      finalResponse.headers.append(
        "Set-Cookie",
        "axis-eco=on; Path=/; Max-Age=86400; SameSite=Strict"
      );
    }

    // Cache at edge
    if (cacheRule.ttl > 0) {
      finalResponse.headers.set(
        "Cache-Control",
        `public, max-age=${cacheRule.ttl}, stale-while-revalidate=${cacheRule.swr}`
      );
      ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));
    }

    return addSecurityHeaders(finalResponse);
  },
};


/**
 * Apply all security headers to a response
 */
function addSecurityHeaders(response) {
  const res = new Response(response.body, response);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}


/**
 * Match a pathname to a cache rule, with prefix fallback
 */
function getCacheRule(path) {
  // Exact match first
  if (CACHE_RULES[path]) return CACHE_RULES[path];

  // Prefix match (e.g. /archive/tuma-logistics)
  for (const [prefix, rule] of Object.entries(CACHE_RULES)) {
    if (prefix !== "/" && path.startsWith(prefix)) return rule;
  }

  // Default: 1 hour cache
  return { ttl: 3600, swr: 300 };
}
