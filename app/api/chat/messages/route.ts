/**
 * Messages API Routes
 *
 * GET /api/chat/messages?listing_id={id}&other_user_id={id}
 * - Get messages for specific listing/conversation
 * - Mark messages as read
 *
 * POST /api/chat/messages
 * - Send new message
 * - Link to listing_id with sender and receiver
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { sendMessageSchema } from '@/lib/validations'
import type { ApiResponse, Message } from '@/types'

// GET - Fetch messages for a conversation
export async function GET(request: NextRequest) {
  try {
    console.log('[CHAT-MESSAGES-GET] Request received')

    // Check authentication
    const authUser = await getCurrentUser()
    if (!authUser) {
      console.log('[CHAT-MESSAGES-GET] Authentication failed')
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      )
    }

    const userId = authUser.userId
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listing_id')
    const otherUserId = searchParams.get('other_user_id')

    console.log('[CHAT-MESSAGES-GET] Fetching messages:', { userId, listingId, otherUserId })

    if (!listingId || !otherUserId) {
      console.log('[CHAT-MESSAGES-GET] Missing parameters')
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'listing_id and other_user_id are required',
        },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Fetch messages for this conversation
    const { data: messages, error: fetchError } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, profile_picture_url),
        receiver:users!messages_receiver_id_fkey(id, full_name, profile_picture_url)
      `)
      .eq('listing_id', listingId)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Database error:', fetchError)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Failed to fetch messages',
        },
        { status: 500 }
      )
    }

    // Mark unread messages from other user as read
    const { error: updateError } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('listing_id', listingId)
      .eq('sender_id', otherUserId)
      .eq('receiver_id', userId)
      .eq('read', false)

    if (updateError) {
      console.error('Failed to mark messages as read:', updateError)
      // Continue anyway
    }

    return NextResponse.json<ApiResponse<{ messages: Message[] }>>(
      {
        success: true,
        data: {
          messages: messages as Message[],
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authUser = await getCurrentUser()
    if (!authUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      )
    }

    const userId = authUser.userId

    // Parse and validate request body
    const body = await request.json()
    const validation = sendMessageSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid request data',
        },
        { status: 400 }
      )
    }

    const { listing_id, receiver_id, content } = validation.data

    // Ensure sender is the authenticated user
    const supabase = createServerClient()

    // Verify listing exists
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, seller_id')
      .eq('id', listing_id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Listing not found',
        },
        { status: 404 }
      )
    }

    // Send message
    const { data: newMessage, error: insertError } = await supabase
      .from('messages')
      .insert({
        listing_id,
        sender_id: userId,
        receiver_id,
        content: content.trim(),
        read: false,
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, profile_picture_url),
        receiver:users!messages_receiver_id_fkey(id, full_name, profile_picture_url)
      `)
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Failed to send message',
        },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<{ message: Message }>>(
      {
        success: true,
        data: {
          message: newMessage as Message,
        },
        message: 'Message sent successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Send message error:', error)
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
