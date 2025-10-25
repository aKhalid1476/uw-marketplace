/**
 * Update User Profile API
 *
 * PUT /api/user/update
 * Updates user profile information (name, avatar)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAuthToken } from '@/lib/auth'
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

    const payload = await verifyAuthToken(token)
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
      .update(updateData)
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

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        profile_picture_url: updatedUser.profile_picture_url,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
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
