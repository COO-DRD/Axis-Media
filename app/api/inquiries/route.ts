// ============================================================================
// API Route: POST /api/inquiries
// Creates a new inquiry from contact forms
// Uses Supabase Service Role to bypass RLS
// ============================================================================

import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/clients'
import { inquirySchema, type InquiryInput } from '@/types/database'

export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json()
    const result = inquirySchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const data: InquiryInput = result.data

    // Create inquiry using admin client (bypasses RLS)
    const supabase = createAdminSupabaseClient()
    
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert({
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.message,
        source: data.source || 'website',
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create inquiry', message: error.message },
        { status: 500 }
      )
    }

    // TODO: Optional - Send notification email to team
    // TODO: Optional - Add to Slack/Discord
    // TODO: Optional - Send confirmation to user

    return NextResponse.json(
      { 
        success: true, 
        message: 'Inquiry submitted successfully',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inquiry: inquiry as any
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
  return NextResponse.json({ status: 'ok', endpoint: '/api/inquiries' })
}
