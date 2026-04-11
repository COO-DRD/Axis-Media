// ============================================================================
// Supabase Database Types - Production Grade
// Complete types matching the comprehensive schema
// ============================================================================

import { z } from 'zod'

// ----------------------------------------------------------------------------
// Enums (matching PostgreSQL enums)
// ----------------------------------------------------------------------------

export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'proposal_sent'
  | 'negotiating'
  | 'closed_won'
  | 'closed_lost'
  | 'nurture'

export type LeadQuality = 'hot' | 'warm' | 'cold' | 'spam' | 'invalid'

export type RevenueRange = 
  | 'under_100k'
  | '100k_500k'
  | '500k_1m'
  | '1m_5m'
  | '5m_10m'
  | 'over_10m'
  | 'unknown'

export type ProjectTimeline = 
  | 'immediate'
  | '1_3_months'
  | '3_6_months'
  | '6_12_months'
  | 'exploring'
  | 'unknown'

export type ChallengeCategory = 
  | 'visibility'
  | 'leads'
  | 'conversion'
  | 'technical_seo'
  | 'content'
  | 'competition'
  | 'reputation'
  | 'strategy'
  | 'other'

export type InquiryType = 
  | 'general'
  | 'partnership'
  | 'media'
  | 'career'
  | 'feedback'
  | 'support'

export type InquiryPriority = 'low' | 'normal' | 'high' | 'urgent'
export type InquiryStatus = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'spam'

// ----------------------------------------------------------------------------
// Lead Interface (Full)
// ----------------------------------------------------------------------------

export interface Lead {
  // Primary
  id: string
  created_at: string
  updated_at: string
  
  // Contact
  name: string
  email: string
  phone: string | null
  company: string | null
  job_title: string | null
  
  // Diagnostic data
  revenue_range: RevenueRange | null
  challenge: ChallengeCategory | null
  challenge_details: string | null
  timeline: ProjectTimeline | null
  
  // Scoring & status
  status: LeadStatus
  quality: LeadQuality
  score: number  // 0-80 auto-calculated
  
  // Attribution
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  referrer_url: string | null
  landing_page: string | null
  
  // Device/Geo
  ip_address: string | null
  user_agent: string | null
  country_code: string | null
  city: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  
  // Engagement
  email_opened: boolean
  email_clicked: boolean
  follow_up_count: number
  last_contact_at: string | null
  next_follow_up_at: string | null
  
  // Internal
  notes: string | null
  assigned_to: string | null
  tags: string[] | null
  
  // Protection
  spam_score: number
  verified: boolean
  duplicate_of: string | null
  
  // Audit
  created_by: string | null
  version: number
}

// ----------------------------------------------------------------------------
// Inquiry Interface (Full)
// ----------------------------------------------------------------------------

export interface Inquiry {
  id: string
  created_at: string
  updated_at: string
  
  // Contact
  name: string
  email: string
  phone: string | null
  company: string | null
  
  // Content
  type: InquiryType
  subject: string | null
  message: string
  attachments: { filename: string; url: string; size: number }[] | null
  
  // Source
  source: string
  page_url: string | null
  referrer_url: string | null
  
  // Device
  ip_address: string | null
  user_agent: string | null
  country_code: string | null
  
  // Workflow
  status: InquiryStatus
  priority: InquiryPriority
  assigned_to: string | null
  
  // Resolution
  response_message: string | null
  responded_at: string | null
  responded_by: string | null
  resolution_time: string | null  // interval as string
  
  // Protection
  spam_score: number
  
  // Internal
  internal_notes: string | null
  tags: string[] | null
}

// ----------------------------------------------------------------------------
// Insert Types (API input - only fields users submit)
// ----------------------------------------------------------------------------

export interface LeadInsert {
  name: string
  email: string
  company?: string | null
  revenue_range?: RevenueRange | null
  challenge?: ChallengeCategory | null
  timeline?: ProjectTimeline | null
  // Server adds: status, quality, score, spam_score, utm_*, device info, etc.
}

export interface InquiryInsert {
  name: string
  email: string
  company?: string | null
  message: string
  type?: InquiryType
  subject?: string | null
  source?: string
  page_url?: string | null
  // Server adds: status, spam_score, device info, etc.
}

// ----------------------------------------------------------------------------
// Database Interface for Supabase Client
// ----------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead
        Insert: LeadInsert
        Update: Partial<Lead>
      }
      inquiries: {
        Row: Inquiry
        Insert: InquiryInsert
        Update: Partial<Inquiry>
      }
    }
    Views: {
      lead_dashboard: Lead
      conversion_funnel: {
        status: LeadStatus
        quality: LeadQuality
        count: number
        avg_score: number
        oldest: string
        newest: string
      }
      daily_metrics: {
        day: string
        valid_leads: number
        spam_leads: number
        avg_quality_score: number
        traffic_sources: number
      }
    }
  }
}

// ----------------------------------------------------------------------------
// Zod Schemas (Validation)
// ----------------------------------------------------------------------------

export const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  company: z.string().max(100).optional().nullable(),
  revenue_range: z.enum([
    'under_100k', '100k_500k', '500k_1m', '1m_5m', '5m_10m', 'over_10m', 'unknown'
  ]).optional().nullable(),
  challenge: z.enum([
    'visibility', 'leads', 'conversion', 'technical_seo', 'content', 
    'competition', 'reputation', 'strategy', 'other'
  ]).optional().nullable(),
  timeline: z.enum([
    'immediate', '1_3_months', '3_6_months', '6_12_months', 'exploring', 'unknown'
  ]).optional().nullable(),
})

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  company: z.string().max(100).optional().nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  type: z.enum(['general', 'partnership', 'media', 'career', 'feedback', 'support']).optional(),
  subject: z.string().max(200).optional().nullable(),
  source: z.string().max(50).optional(),
  page_url: z.string().max(500).optional().nullable(),
})

// ----------------------------------------------------------------------------
// Inferred Types
// ----------------------------------------------------------------------------

export type LeadInput = z.infer<typeof leadSchema>
export type InquiryInput = z.infer<typeof inquirySchema>

// ----------------------------------------------------------------------------
// API Response Types
// ----------------------------------------------------------------------------

export interface ApiSuccessResponse<T> {
  success: true
  message: string
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  details?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// ----------------------------------------------------------------------------
// Rate Limit Types
// ----------------------------------------------------------------------------

export interface RateLimitStatus {
  allowed: boolean
  remaining: number
  resetAt: string
}

// ----------------------------------------------------------------------------
// Utility Types
// ----------------------------------------------------------------------------

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type WithTimestamps<T> = T & {
  created_at: string
  updated_at: string
}
