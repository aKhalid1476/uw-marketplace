/**
 * Listings API Routes
 *
 * GET /api/listings - Get all listings (with optional filters)
 * POST /api/listings - Create a new listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { verifyToken } from '@/lib/auth'

// Validation schema for creating a listing
const createListingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  category: z.enum(['Electronics', 'Furniture', 'Books', 'Clothing', 'Tickets', 'Other']),
  image_urls: z.array(z.string()).optional(), // Accept any string (URL or base64)
})

// GET - Fetch listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const user = searchParams.get('user')

    const supabase = createServerClient()
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    // Filter by search query
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Filter by user (for "my listings")
    if (user === 'me') {
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

      query = query.eq('seller_id', payload.userId)
    }

    const { data: listings, error } = await query

    if (error) {
      console.error('Failed to fetch listings:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    // Transform listings to match ListingCard type
    const transformedListings = (listings || []).map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      category: listing.category,
      image_url: listing.image_urls && listing.image_urls.length > 0 ? listing.image_urls[0] : null,
      created_at: listing.created_at,
      seller_name: null, // Will be populated if needed
      status: listing.status,
    }))

    return NextResponse.json({
      success: true,
      listings: transformedListings,
    })
  } catch (error) {
    console.error('Get listings error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new listing
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createListingSchema.safeParse(body)

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

    const { title, description, price, category, image_urls } = validationResult.data

    // Create listing in database
    const supabase = createServerClient()
    const { data: listing, error: createError } = await supabase
      .from('listings')
      .insert({
        seller_id: payload.userId,
        title,
        description: description || null,
        price,
        category,
        image_urls: image_urls || [],
        status: 'active',
      })
      .select()
      .single()

    if (createError) {
      console.error('Failed to create listing:', createError)
      return NextResponse.json(
        { success: false, error: 'Failed to create listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      listing,
    })
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
