/**
 * Chat Utilities
 *
 * Functions for managing real-time chat with Supabase Realtime
 */

import { createClient } from '@/lib/supabase/client'
import type { Message, MessageThread } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

// =====================================================
// CONVERSATION MANAGEMENT
// =====================================================

/**
 * Get unique conversation ID for two users
 * Always returns same ID regardless of who is sender/receiver
 */
export function getConversationId(userId1: string, userId2: string, listingId: string): string {
  const sortedIds = [userId1, userId2].sort()
  return `${sortedIds[0]}_${sortedIds[1]}_${listingId}`
}

/**
 * Get all conversations for current user
 */
export async function getConversations(userId: string): Promise<MessageThread[]> {
  const supabase = createClient()

  try {
    // Get all messages where user is sender or receiver
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        listing:listings(id, title, image_urls, status),
        sender:users!messages_sender_id_fkey(id, full_name, profile_picture_url),
        receiver:users!messages_receiver_id_fkey(id, full_name, profile_picture_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group messages by conversation (listing + other user)
    const conversationMap = new Map<string, MessageThread>()

    messages?.forEach((message: any) => {
      const otherUser =
        message.sender_id === userId ? message.receiver : message.sender
      const conversationKey = `${message.listing_id}_${otherUser.id}`

      if (!conversationMap.has(conversationKey)) {
        conversationMap.set(conversationKey, {
          id: conversationKey,
          listing_id: message.listing_id,
          listing_title: message.listing?.title || 'Deleted Listing',
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.content,
          read: message.read,
          created_at: message.created_at,
          sender_name: message.sender?.full_name,
          receiver_name: message.receiver?.full_name,
          other_user_id: otherUser.id,
          other_user_name: otherUser.full_name,
          other_user_picture: otherUser.profile_picture_url,
        })
      }
    })

    return Array.from(conversationMap.values())
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return []
  }
}

/**
 * Get messages for a specific conversation
 */
export async function getMessages(
  listingId: string,
  userId1: string,
  userId2: string
): Promise<Message[]> {
  const supabase = createClient()

  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, profile_picture_url),
        receiver:users!messages_receiver_id_fkey(id, full_name, profile_picture_url)
      `)
      .eq('listing_id', listingId)
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true })

    if (error) throw error

    return (messages as any) || []
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

/**
 * Send a new message
 */
export async function sendMessage(
  listingId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<{ success: boolean; message?: Message; error?: string }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        listing_id: listingId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim(),
        read: false,
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, message: data as Message }
  } catch (error) {
    console.error('Error sending message:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    }
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  listingId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('listing_id', listingId)
      .eq('receiver_id', userId)
      .eq('read', false)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return false
  }
}

/**
 * Get unread message count for user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient()

  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('read', false)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

/**
 * Subscribe to new messages for a specific conversation
 */
export function subscribeToMessages(
  listingId: string,
  userId1: string,
  userId2: string,
  onMessage: (message: Message) => void
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase
    .channel(`messages:${listingId}:${userId1}:${userId2}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `listing_id=eq.${listingId}`,
      },
      (payload) => {
        const newMessage = payload.new as Message

        // Only process if message is part of this conversation
        if (
          (newMessage.sender_id === userId1 &&
            newMessage.receiver_id === userId2) ||
          (newMessage.sender_id === userId2 &&
            newMessage.receiver_id === userId1)
        ) {
          onMessage(newMessage)
        }
      }
    )
    .subscribe()

  return channel
}

/**
 * Subscribe to all messages for current user (for notifications)
 */
export function subscribeToAllMessages(
  userId: string,
  onMessage: (message: Message) => void
): RealtimeChannel {
  const supabase = createClient()

  const channel = supabase
    .channel(`user-messages:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      },
      (payload) => {
        onMessage(payload.new as Message)
      }
    )
    .subscribe()

  return channel
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribe(channel: RealtimeChannel): Promise<void> {
  await channel.unsubscribe()
}

// =====================================================
// TYPING INDICATORS
// =====================================================

/**
 * Broadcast typing status
 */
export function broadcastTyping(
  channel: RealtimeChannel,
  userId: string,
  isTyping: boolean
): void {
  channel.send({
    type: 'broadcast',
    event: 'typing',
    payload: { userId, isTyping },
  })
}

/**
 * Listen for typing indicators
 */
export function listenForTyping(
  channel: RealtimeChannel,
  onTyping: (userId: string, isTyping: boolean) => void
): void {
  channel.on('broadcast', { event: 'typing' }, (payload) => {
    const { userId, isTyping } = payload.payload
    onTyping(userId, isTyping)
  })
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Get other user in conversation
 */
export function getOtherUserId(
  currentUserId: string,
  senderId: string,
  receiverId: string
): string {
  return currentUserId === senderId ? receiverId : senderId
}

/**
 * Format conversation time
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = (now.getTime() - date.getTime()) / 1000

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * Truncate message for preview
 */
export function truncateMessage(content: string, maxLength: number = 50): string {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}
