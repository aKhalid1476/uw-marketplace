/**
 * Individual Listing API Routes
 *
 * GET /api/listings/[id] - Get a single listing with seller info
 * DELETE /api/listings/[id] - Delete a listing (owner only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyToken } from '@/lib/auth'

// GET - Fetch a single listing
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServerClient()
    const { id } = await context.params

    // Fetch the listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Fetch seller information
    const { data: seller, error: sellerError } = await supabase
      .from('users')
      .select('id, email, full_name, profile_picture_url')
      .eq('id', (listing as any).seller_id)
      .single()

    if (sellerError) {
      console.error('Failed to fetch seller:', sellerError)
    }

    return NextResponse.json({
      success: true,
      listing,
      seller: seller || null,
    })
  } catch (error) {
    console.error('Get listing error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a listing (owner only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()
    const { id } = await context.params

    // Check if listing exists and user is the owner
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    if ((listing as any).seller_id !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the listing
    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Failed to delete listing:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Listing deleted successfully',
    })
  } catch (error) {
    console.error('Delete listing error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
