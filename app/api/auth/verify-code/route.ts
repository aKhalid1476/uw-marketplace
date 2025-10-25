/**
 * POST /api/auth/verify-code
 *
 * Verify the code and authenticate the user
 * - Verify code matches and hasn't expired
 * - Create or update user in users table
 * - Generate JWT token and set httpOnly cookie
 * - Return user data
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import {
  createAuthToken,
  setAuthCookie,
  isCodeExpired,
} from '@/lib/auth'
import { emailVerificationSubmitSchema } from '@/lib/validations'
import type { ApiResponse, User } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validation = emailVerificationSubmitSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid request data',
        },
        { status: 400 }
      )
    }

    const { email, code } = validation.data

    // Get verification code from database
    const supabase = createServerClient()

    const { data: verificationCodes, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error('Database error:', fetchError)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Failed to verify code. Please try again.',
        },
        { status: 500 }
      )
    }

    // Check if code exists
    if (!verificationCodes || verificationCodes.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid verification code. Please check and try again.',
        },
        { status: 401 }
      )
    }

    const verificationCode = verificationCodes[0]

    // Check if code is expired
    if (isCodeExpired(verificationCode.expires_at)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Verification code has expired. Please request a new one.',
        },
        { status: 401 }
      )
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationCode.id)

    if (updateError) {
      console.error('Failed to mark code as used:', updateError)
      // Continue anyway - code validation succeeded
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1)

    let user: User

    if (existingUsers && existingUsers.length > 0) {
      // User exists - update last login
      user = existingUsers[0] as User

      const { error: updateUserError } = await supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', user.id)

      if (updateUserError) {
        console.error('Failed to update user:', updateUserError)
      }
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          full_name: null,
          profile_picture_url: null,
        })
        .select()
        .single()

      if (insertError || !newUser) {
        console.error('Failed to create user:', insertError)
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'Failed to create user account. Please try again.',
          },
          { status: 500 }
        )
      }

      user = newUser as User
    }

    // Generate JWT token
    const token = await createAuthToken(user)

    // Set auth cookie
    await setAuthCookie(token)

    // Return success response with user data
    return NextResponse.json<ApiResponse<{ user: User }>>(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            profile_picture_url: user.profile_picture_url,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        },
        message: 'Authentication successful',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify code error:', error)
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
