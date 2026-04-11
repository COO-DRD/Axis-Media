// ============================================================================
// Production API Route Example
// Full implementation with rate limiting, spam detection, and security
// Copy contents to app/api/leads/route.ts when ready to deploy
// ============================================================================

import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/clients'
import { leadSchema, type LeadInput, type LeadInsert, type Lead } from '@/types/database'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MINUTES = 60

const SUSPICIOUS_PATTERNS = [
  /\$\$\$/i, /make money fast/i, /click here/i,
  /viagra|cialis/i, /casino|lottery|win/i,
  /(.)\1{5,}/,
]

const DISPOSABLE_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'throwawaymail.com', 'yopmail.com',
]

// Must await headers() in App Router
async function getClientIP(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  return forwarded?.split(',')[0].trim() || realIP || 'unknown'
}

async function checkRateLimit(ip: string) {
  const supabase = createAdminSupabaseClient()
  const windowStart = new Date()
  windowStart.setMinutes(0, 0, 0)
  
  // Check if blocked
  const { data: blocked } = await supabase
    .from('ip_blocks' as any)
    .select('expires_at')
    .eq('ip_address', ip)
    .or('expires_at.is.null,expires_at.gt.now()')
    .single()
  
  if (blocked) {
    return { allowed: false, resetAt: new Date((blocked as any).expires_at || Date.now() + 86400000) }
  }
  
  // Get current count - use maybeSingle() instead of single()
  const { data: rateLimit } = await supabase
    .from('rate_limits' as any)
    .select('*')
    .eq('ip_address', ip)
    .eq('endpoint', '/api/leads')
    .eq('window_start', windowStart.toISOString())
    .maybeSingle()
  
  const currentCount = (rateLimit as any)?.request_count || 0
  
  if (currentCount >= RATE_LIMIT_MAX) {
    const blockedUntil = new Date(Date.now() + 60 * 60 * 1000)
    
    if ((rateLimit as any)?.id) {
      await (supabase.from('rate_limits' as any) as any).update({
        blocked_until: blockedUntil.toISOString()
      }).eq('id', (rateLimit as any).id)
    }
    
    return { allowed: false, resetAt: blockedUntil }
  }
  
  // Increment
  if ((rateLimit as any)?.id) {
    await (supabase.from('rate_limits' as any) as any).update({
      request_count: currentCount + 1
    }).eq('id', (rateLimit as any).id)
  } else {
    await (supabase.from('rate_limits' as any) as any).insert({
      ip_address: ip,
      endpoint: '/api/leads',
      window_start: windowStart.toISOString(),
      request_count: 1
    })
  }
  
  const resetAt = new Date(windowStart.getTime() + RATE_LIMIT_WINDOW_MINUTES * 60 * 1000)
  return { allowed: true, remaining: RATE_LIMIT_MAX - currentCount - 1, resetAt }
}

function calculateSpamScore(data: LeadInput, userAgent: string): number {
  let score = 0
  const emailDomain = data.email.split('@')[1]?.toLowerCase() || ''
  
  if (DISPOSABLE_DOMAINS.some(d => emailDomain === d)) {
    score += 50
  }
  
  if (data.company) {
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(data.company)) {
        score += 30
        break
      }
    }
  }
  
  if (!userAgent || userAgent.includes('bot') || userAgent.includes('crawler')) {
    score += 40
  }
  
  return Math.min(score, 100)
}

function parseDeviceInfo(userAgent: string) {
  try {
    const parser = new UAParser(userAgent)
    return {
      device_type: parser.getDevice().type || 'desktop',
      browser: parser.getBrowser().name || 'unknown',
      os: parser.getOS().name || 'unknown'
    }
  } catch {
    return { device_type: 'unknown', browser: 'unknown', os: 'unknown' }
  }
}

export async function POST(request: Request) {
  try {
    const ip = await getClientIP()
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const referer = headersList.get('referer') || ''
    
    // Rate limiting
    const rateLimit = await checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many submissions. Please try again later.',
          resetAt: rateLimit.resetAt.toISOString()
        },
        { status: 429 }
      )
    }
    
    // Validate
    const body = await request.json()
    const result = leadSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data: LeadInput = result.data
    const spamScore = calculateSpamScore(data, userAgent)
    
    // Silently reject spam
    if (spamScore >= 80) {
      console.warn('Spam rejected:', { email: data.email, score: spamScore, ip })
      return NextResponse.json(
        { success: true, message: 'Diagnostic submitted successfully' },
        { status: 201 }
      )
    }
    
    const url = new URL(referer || 'http://localhost')
    const deviceInfo = parseDeviceInfo(userAgent)
    
    const insertData: LeadInsert = {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      company: data.company || null,
      revenue_range: data.revenue_range || null,
      challenge: data.challenge || null,
      timeline: data.timeline || null,
    }
    
    const enrichedData = {
      ...insertData,
      utm_source: url.searchParams.get('utm_source') || body.utm_source || null,
      utm_medium: url.searchParams.get('utm_medium') || body.utm_medium || null,
      utm_campaign: url.searchParams.get('utm_campaign') || body.utm_campaign || null,
      referrer_url: referer || null,
      landing_page: body.landing_page || referer || null,
      ip_address: ip,
      user_agent: userAgent,
      country_code: body.country_code || null,
      city: body.city || null,
      ...deviceInfo,
      spam_score: spamScore,
    }

    const supabase = createAdminSupabaseClient()
    
    const { data: lead, error } = await supabase
      .from('leads')
      .insert(enrichedData as never)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create lead', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Diagnostic submitted successfully',
        lead: {
          id: (lead as Lead).id,
          created_at: (lead as Lead).created_at,
          score: (lead as Lead).score,
          quality: (lead as Lead).quality
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const ip = await getClientIP()
  const rateLimit = await checkRateLimit(ip)
  
  return NextResponse.json({ 
    status: 'ok', 
    rateLimit: {
      limit: RATE_LIMIT_MAX,
      remaining: rateLimit.remaining,
      resetAt: rateLimit.resetAt.toISOString()
    }
  })
}
