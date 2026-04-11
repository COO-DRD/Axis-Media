// ============================================================================
// API Route: POST /api/leads
// Creates a new lead from diagnostic form submission
// Uses Supabase Service Role to bypass RLS
// ============================================================================

import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/clients'
import { leadSchema, type LeadInput } from '@/types/database'

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json()
    const result = leadSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const data: LeadInput = result.data

    // Create lead using admin client (bypasses RLS)
    const supabase = createAdminSupabaseClient()
    
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        company: data.company || null,
        revenue_range: data.revenue_range || null,
        challenge: data.challenge || null,
        timeline: data.timeline || null,
        status: 'new',
        notes: null,
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create lead', message: error.message },
        { status: 500 }
      )
    }

    // TODO: Optional - Send notification email, add to CRM, etc.
    // TODO: Optional - Send auto-reply to lead

    return NextResponse.json(
      { 
        success: true, 
        message: 'Diagnostic submitted successfully',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lead: lead as any
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

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/leads' })
}
