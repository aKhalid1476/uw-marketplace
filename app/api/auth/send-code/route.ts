/**
 * POST /api/auth/send-code
 *
 * Send a verification code to the user's email
 * - Validates email ends with @uwaterloo.ca
 * - Generates 6-digit code
 * - Stores in verification_codes table with 10-minute expiry
 * - Sends email using Resend
 * - Implements rate limiting (max 3 codes per email per hour)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import {
  generateVerificationCode,
  getCodeExpiration,
  sendVerificationEmail,
  checkRateLimit,
  recordAttempt,
  getRateLimitResetTime,
} from '@/lib/auth'
import { emailVerificationRequestSchema } from '@/lib/validations'
import type { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validation = emailVerificationRequestSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid email address',
        },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Check rate limit
    if (checkRateLimit(email)) {
      const resetTime = getRateLimitResetTime(email)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Too many requests. Please try again in ${resetTime} minutes.`,
        },
        { status: 429 }
      )
    }

    // Generate verification code
    const code = generateVerificationCode()
    const expiresAt = getCodeExpiration(10) // 10 minutes

    // Store verification code in database
    const supabase = createServerClient()

    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
      })

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Failed to generate verification code. Please try again.',
        },
        { status: 500 }
      )
    }

    // DEVELOPMENT MODE: Log code to console instead of sending email
    // In production, uncomment the email sending code below
    console.log('===========================================')
    console.log('📧 VERIFICATION CODE FOR:', email)
    console.log('🔑 CODE:', code)
    console.log('⏰ EXPIRES AT:', expiresAt.toLocaleString())
    console.log('===========================================')

    // Send verification email (commented out for development)
    // Uncomment this in production when you have a verified domain on Resend
    /*
    const emailResult = await sendVerificationEmail(email, code)

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Failed to send verification email. Please try again.',
        },
        { status: 500 }
      )
    }
    */

    // Record attempt for rate limiting
    recordAttempt(email)

    // Return success response
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message: 'Verification code sent successfully',
          expiresIn: 10, // minutes
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
