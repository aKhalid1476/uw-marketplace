/**
 * Update User Profile API
 *
 * PUT /api/user/update
 * Updates user profile information (name, avatar)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyToken } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'

// Validation schema
const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  profile_picture_url: z.string().url('Invalid URL').optional().nullable(),
})

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const userId = payload.userId as string

    // Parse and validate request body
    const body = await request.json()
    const validationResult = updateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      )
    }

    const { full_name, profile_picture_url } = validationResult.data

    // Update user in database
    const supabase = createServerClient()

    // Build update object with only provided fields
    const updateData: any = {}
    if (full_name !== undefined) {
      updateData.full_name = full_name
    }
    if (profile_picture_url !== undefined) {
      updateData.profile_picture_url = profile_picture_url
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString()

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData as never)
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update user:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Type assertion needed for Supabase TypeScript inference
    const user = updatedUser as any

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        profile_picture_url: user.profile_picture_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
