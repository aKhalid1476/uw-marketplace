/**
 * Message Bubble Component
 *
 * Individual message display in chat
 */

'use client'

import { formatDistanceToNow } from 'date-fns'
import { Check, CheckCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
}

export function MessageBubble({
  message,
  isOwnMessage,
  showAvatar = true,
  showTimestamp = true,
}: MessageBubbleProps) {
  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const senderName = isOwnMessage
    ? 'You'
    : (message.sender as any)?.full_name || 'Unknown'

  const senderPicture = (message.sender as any)?.profile_picture_url

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isOwnMessage ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      {showAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={senderPicture || undefined} />
          <AvatarFallback
            className={cn(
              'text-sm',
              isOwnMessage
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={cn(
          'flex flex-col max-w-[70%]',
          isOwnMessage ? 'items-end' : 'items-start'
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-2 break-words',
            isOwnMessage
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-900 rounded-tl-none'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Timestamp and Status */}
        {showTimestamp && (
          <div
            className={cn(
              'flex items-center gap-1 mt-1 text-xs text-gray-500',
              isOwnMessage && 'flex-row-reverse'
            )}
          >
            <span>
              {formatDistanceToNow(new Date(message.created_at), {
                addSuffix: true,
              })}
            </span>

            {/* Read status (only for own messages) */}
            {isOwnMessage && (
              <span>
                {message.read ? (
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Typing indicator component
 */
export function TypingIndicator({ userName }: { userName: string }) {
  return (
    <div className="flex gap-3 mb-4">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
          {userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex gap-1">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
          <div
            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Date separator for message groups
 */
export function DateSeparator({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
        {new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}
      </div>
    </div>
  )
}
