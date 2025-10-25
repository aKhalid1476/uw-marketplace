/**
 * GET /api/auth/me
 *
 * Get the current authenticated user
 * - Check authentication cookie
 * - Verify JWT token
 * - Fetch and return user data from database
 */

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import type { ApiResponse, User } from '@/types'

export async function GET() {
  try {
    // Get current user from auth token
    const authUser = await getCurrentUser()

    if (!authUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Not authenticated',
        },
        { status: 401 }
      )
    }

    // Fetch full user data from database
    const supabase = createServerClient()

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.userId)
      .single()

    if (error || !user) {
      console.error('Failed to fetch user:', error)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      )
    }

    // Return user data
    return NextResponse.json<ApiResponse<{ user: User }>>(
      {
        success: true,
        data: {
          user: user as User,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
