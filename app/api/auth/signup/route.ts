/**
 * Signup API Route
 *
 * POST /api/auth/signup
 * Verifies the code and creates a new user with password
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createAuthToken, hashPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

// Validation schema
const signupSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = signupSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { email, code, password, full_name } = validationResult.data
    const normalizedEmail = email.toLowerCase().trim()

    const supabase = createServerClient()

    // Verify the code
    const { data: verificationRecord, error: verifyError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('code', code)
      .eq('used', false)
      .single()

    if (verifyError || !verificationRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Check if code is expired
    const record = verificationRecord as any
    const expiresAt = new Date(record.expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Create the user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: normalizedEmail,
        password_hash: passwordHash,
        full_name: full_name || null,
        email_verified: true,
      } as any)
      .select()
      .single()

    if (createError) {
      console.error('Failed to create user:', createError)
      return NextResponse.json(
        { success: false, error: 'Failed to create account' },
        { status: 500 }
      )
    }

    // Mark the verification code as used
    await (supabase
      .from('verification_codes')
      .update({ used: true } as any)
      .eq('id', record.id) as any)

    // Create auth token
    const user = newUser as any
    const token = await createAuthToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      profile_picture_url: user.profile_picture_url,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        profile_picture_url: user.profile_picture_url,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
