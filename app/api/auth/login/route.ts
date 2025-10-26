/**
 * Login API Route
 *
 * POST /api/auth/login
 * Authenticates user with email and password
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { createAuthToken, verifyPassword } from '@/lib/auth'
import { cookies } from 'next/headers'

// Validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      console.log('[LOGIN] Validation failed:', validationResult.error.flatten())
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data
    const normalizedEmail = email.toLowerCase().trim()
    console.log('[LOGIN] Attempting login for:', normalizedEmail)

    const supabase = createServerClient()

    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single()

    if (userError || !user) {
      console.log('[LOGIN] User not found or error:', userError?.message)
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, (user as any).password_hash)

    if (!isValidPassword) {
      console.log('[LOGIN] Invalid password for:', normalizedEmail)
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('[LOGIN] Login successful for:', normalizedEmail)

    // Create auth token
    const userData = user as any
    const token = await createAuthToken({
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      profile_picture_url: userData.profile_picture_url,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
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
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          profile_picture_url: userData.profile_picture_url,
        },
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
