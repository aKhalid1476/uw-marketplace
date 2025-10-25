/**
 * Conversation List Component
 *
 * List of all chat conversations with previews
 */

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { formatMessageTime, truncateMessage } from '@/lib/chat'
import { cn } from '@/lib/utils'

interface Conversation {
  id: string
  listing_id: string
  listing_title: string
  listing_image: string | null
  listing_status: string
  other_user_id: string
  other_user_name: string | null
  other_user_picture: string | null
  last_message: string
  last_message_time: string
  last_message_sender_id: string
  is_read: boolean
  unread_count: number
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedConversationId: string | null
  onSelectConversation: (conversation: Conversation) => void
  currentUserId: string
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) {
  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-gray-600 max-w-sm">
          Start browsing listings and contact sellers to begin chatting
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-600">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedConversationId
          const isOwnMessage = conversation.last_message_sender_id === currentUserId

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={cn(
                'w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left',
                isSelected && 'bg-purple-50 hover:bg-purple-50 border-l-4 border-l-purple-600',
                !conversation.is_read && !isSelected && 'bg-blue-50/50'
              )}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.other_user_picture || undefined} />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {getInitials(conversation.other_user_name)}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.unread_count > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name and Time */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.other_user_name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatMessageTime(conversation.last_message_time)}
                    </span>
                  </div>

                  {/* Listing Title */}
                  <p className="text-xs text-gray-600 mb-1 truncate">
                    Re: {conversation.listing_title}
                  </p>

                  {/* Last Message */}
                  <p
                    className={cn(
                      'text-sm text-gray-600 truncate',
                      !conversation.is_read && !isOwnMessage && 'font-semibold text-gray-900'
                    )}
                  >
                    {isOwnMessage && <span className="text-gray-500">You: </span>}
                    {truncateMessage(conversation.last_message, 60)}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Loading skeleton for conversation list
 */
export function ConversationListSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
      </div>

      <div className="flex-1 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
