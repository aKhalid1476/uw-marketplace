/**
 * POST /api/auth/logout
 *
 * Logout the current user
 * - Clear authentication cookie
 * - Return success response
 */

import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'
import type { ApiResponse } from '@/types'

export async function POST() {
  try {
    // Clear authentication cookie
    await clearAuthCookie()

    // Return success response
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to logout. Please try again.',
      },
      { status: 500 }
    )
  }
}

// Also support GET for convenience
export async function GET() {
  return POST()
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
