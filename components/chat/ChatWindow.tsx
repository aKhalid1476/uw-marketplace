/**
 * Chat Window Component
 *
 * Main chat interface with real-time messages
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Package } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageBubble, TypingIndicator, DateSeparator } from './MessageBubble'
import { SendMessageForm } from './SendMessageForm'
import { subscribeToMessages, unsubscribe } from '@/lib/chat'
import type { Message } from '@/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface ChatWindowProps {
  listingId: string
  listingTitle: string
  listingImage: string | null
  listingStatus: string
  otherUserId: string
  otherUserName: string | null
  otherUserPicture: string | null
  currentUserId: string
  initialMessages: Message[]
  onSendMessage: (content: string) => Promise<void>
  onBack?: () => void
}

export function ChatWindow({
  listingId,
  listingTitle,
  listingImage,
  listingStatus,
  otherUserId,
  otherUserName,
  otherUserPicture,
  currentUserId,
  initialMessages,
  onSendMessage,
  onBack,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Update messages when initialMessages change
  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Set up real-time subscription
  useEffect(() => {
    const channel = subscribeToMessages(
      listingId,
      currentUserId,
      otherUserId,
      (newMessage) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === newMessage.id)) {
            return prev
          }
          return [...prev, newMessage]
        })
      }
    )

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        unsubscribe(channelRef.current)
      }
    }
  }, [listingId, currentUserId, otherUserId])

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''

    messages.forEach((message) => {
      const messageDate = new Date(message.created_at).toDateString()
      if (messageDate !== currentDate) {
        currentDate = messageDate
        groups.push({ date: messageDate, messages: [message] })
      } else {
        groups[groups.length - 1].messages.push(message)
      }
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          {/* Back button (mobile) */}
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Other user info */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUserPicture || undefined} />
            <AvatarFallback className="bg-purple-100 text-purple-700">
              {getInitials(otherUserName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">
              {otherUserName || 'Unknown User'}
            </h2>
            <p className="text-sm text-gray-600 truncate">
              Re: {listingTitle}
            </p>
          </div>

          {/* View listing button */}
          <Link href={`/listing/${listingId}`}>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Listing Info Banner */}
      {listingImage && (
        <Link
          href={`/listing/${listingId}`}
          className="border-b border-gray-200 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={listingImage}
                alt={listingTitle}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">
                {listingTitle}
              </p>
              {listingStatus && (
                <Badge
                  variant={listingStatus === 'active' ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {listingStatus}
                </Badge>
              )}
            </div>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
        {messageGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-purple-100 rounded-full p-6 mb-4">
              <Package className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start the conversation
            </h3>
            <p className="text-gray-600 max-w-sm">
              Send a message to {otherUserName || 'the seller'} about this listing
            </p>
          </div>
        ) : (
          <>
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <DateSeparator date={group.date} />
                {group.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={message.sender_id === currentUserId}
                    showAvatar
                    showTimestamp
                  />
                ))}
              </div>
            ))}

            {isTyping && <TypingIndicator userName={otherUserName || 'User'} />}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Send Message Form */}
      <SendMessageForm
        onSend={onSendMessage}
        onTyping={setIsTyping}
        placeholder={`Message ${otherUserName || 'seller'}...`}
      />
    </div>
  )
}

/**
 * Empty state when no conversation selected
 */
export function ChatWindowEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white p-8 text-center">
      <div className="bg-purple-100 rounded-full p-8 mb-6">
        <Package className="h-16 w-16 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Select a conversation
      </h2>
      <p className="text-gray-600 max-w-md">
        Choose a conversation from the list to start chatting with buyers and sellers
      </p>
    </div>
  )
}
