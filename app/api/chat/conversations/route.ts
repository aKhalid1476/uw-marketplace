/**
 * GET /api/chat/conversations
 *
 * Get all conversations for the current user
 * - Returns conversations with last message preview
 * - Sorted by most recent activity
 * - Includes unread count per conversation
 */

import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import type { ApiResponse, MessageThread } from '@/types'

export async function GET() {
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
    const supabase = createServerClient()

    // Get all messages where user is involved
    const { data: allMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        *,
        listing:listings(id, title, image_urls, status),
        sender:users!messages_sender_id_fkey(id, full_name, profile_picture_url),
        receiver:users!messages_receiver_id_fkey(id, full_name, profile_picture_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (messagesError) {
      console.error('Database error:', messagesError)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Failed to fetch conversations',
        },
        { status: 500 }
      )
    }

    // Group messages by conversation
    const conversationMap = new Map<string, any>()

    allMessages?.forEach((message: any) => {
      const otherUser =
        message.sender_id === userId
          ? message.receiver
          : message.sender

      const conversationKey = `${message.listing_id}_${otherUser.id}`

      // Only keep the most recent message for each conversation
      if (!conversationMap.has(conversationKey)) {
        conversationMap.set(conversationKey, {
          id: conversationKey,
          listing_id: message.listing_id,
          listing_title: message.listing?.title || 'Deleted Listing',
          listing_image: message.listing?.image_urls?.[0] || null,
          listing_status: message.listing?.status,
          other_user_id: otherUser.id,
          other_user_name: otherUser.full_name,
          other_user_picture: otherUser.profile_picture_url,
          last_message: message.content,
          last_message_time: message.created_at,
          last_message_sender_id: message.sender_id,
          is_read: message.receiver_id === userId ? message.read : true,
        })
      }
    })

    const conversations = Array.from(conversationMap.values())

    // Calculate unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('listing_id', conv.listing_id)
          .eq('sender_id', conv.other_user_id)
          .eq('receiver_id', userId)
          .eq('read', false)

        return {
          ...conv,
          unread_count: count || 0,
        }
      })
    )

    return NextResponse.json<ApiResponse<{ conversations: any[] }>>(
      {
        success: true,
        data: {
          conversations: conversationsWithUnread,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}
