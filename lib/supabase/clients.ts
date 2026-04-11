// ============================================================================
// Supabase Clients - Simplified
// Browser, Server, and Admin (Service Role) clients
// ============================================================================

import { createClient } from '@supabase/supabase-js'
import type { Lead, Inquiry } from '@/types/database'

type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead
        Insert: Omit<Lead, 'id' | 'created_at'>
        Update: Partial<Omit<Lead, 'id' | 'created_at'>>
      }
      inquiries: {
        Row: Inquiry
        Insert: Omit<Inquiry, 'id' | 'created_at'>
        Update: Partial<Omit<Inquiry, 'id' | 'created_at'>>
      }
    }
  }
}

// ----------------------------------------------------------------------------
// Browser Client (for Client Components)
// Use this in 'use client' components for user-facing operations
// ----------------------------------------------------------------------------
export function createBrowserSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ----------------------------------------------------------------------------
// Server Client (for Server Components)
// Use this in async Server Components (no 'use client')
// ----------------------------------------------------------------------------
export function createServerSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  )
}

// ----------------------------------------------------------------------------
// Admin Client (Service Role - Server Only)
// ⚠️ NEVER expose this to the browser - bypasses RLS
// Use only in API routes for admin operations (writing leads, etc.)
// ----------------------------------------------------------------------------
export function createAdminSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. Check .env.local')
  }
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
