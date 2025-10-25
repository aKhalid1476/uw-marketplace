/**
 * Chat Page
 *
 * Two-panel layout with conversations list and chat window
 * Real-time updates using Supabase Realtime
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ConversationList, ConversationListSkeleton } from '@/components/chat/ConversationList'
import { ChatWindow, ChatWindowEmpty } from '@/components/chat/ChatWindow'
import type { Message } from '@/types'

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

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showMobileChat, setShowMobileChat] = useState(false)

  // Check authentication and get current user
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (data.success) {
        setCurrentUserId(data.data.user.id)
      } else {
        // Redirect to login
        router.push('/login?redirect=/chat')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login?redirect=/chat')
    }
  }

  // Fetch conversations
  useEffect(() => {
    if (!currentUserId) return

    fetchConversations()
  }, [currentUserId])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/chat/conversations')
      const data = await response.json()

      if (data.success) {
        setConversations(data.data.conversations || [])

        // Auto-select conversation from query params
        const listingId = searchParams.get('listing')
        const userId = searchParams.get('user')

        if (listingId && userId) {
          // Check if conversation exists
          const existingConv = data.data.conversations.find(
            (c: Conversation) => c.listing_id === listingId && c.other_user_id === userId
          )

          if (existingConv) {
            handleSelectConversation(existingConv)
          } else {
            // Create new conversation object for first-time chat
            createNewConversation(listingId, userId)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create a new conversation when contacting a seller for the first time
  const createNewConversation = async (listingId: string, otherUserId: string) => {
    try {
      // Fetch listing details
      const listingResponse = await fetch(`/api/listings/${listingId}`)
      const listingData = await listingResponse.json()

      if (!listingData.success) {
        console.error('Failed to fetch listing')
        return
      }

      const { listing, seller } = listingData

      // Create a temporary conversation object
      const newConversation: Conversation = {
        id: `${listingId}_${otherUserId}`,
        listing_id: listingId,
        listing_title: listing.title,
        listing_image: listing.image_urls && listing.image_urls.length > 0 ? listing.image_urls[0] : null,
        listing_status: listing.status,
        other_user_id: otherUserId,
        other_user_name: seller?.full_name || null,
        other_user_picture: seller?.profile_picture_url || null,
        last_message: '',
        last_message_time: new Date().toISOString(),
        last_message_sender_id: currentUserId || '',
        is_read: true,
        unread_count: 0,
      }

      // Add to conversations list
      setConversations(prev => [newConversation, ...prev])
      setSelectedConversation(newConversation)
      setMessages([])
      setShowMobileChat(true)
    } catch (error) {
      console.error('Failed to create new conversation:', error)
    }
  }

  // Fetch messages for selected conversation
  const fetchMessages = async (conversation: Conversation) => {
    setMessagesLoading(true)
    try {
      const response = await fetch(
        `/api/chat/messages?listing_id=${conversation.listing_id}&other_user_id=${conversation.other_user_id}`
      )
      const data = await response.json()

      if (data.success) {
        setMessages(data.data.messages || [])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setMessagesLoading(false)
    }
  }

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    fetchMessages(conversation)
    setShowMobileChat(true)

    // Mark as read locally
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation.id
          ? { ...c, is_read: true, unread_count: 0 }
          : c
      )
    )
  }

  // Handle send message
  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !currentUserId) return

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: selectedConversation.listing_id,
          receiver_id: selectedConversation.other_user_id,
          content,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Add message to local state immediately
        const newMessage = data.data.message
        setMessages((prev) => [...prev, newMessage])

        // Update conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedConversation.id
              ? {
                  ...c,
                  last_message: content,
                  last_message_time: new Date().toISOString(),
                  last_message_sender_id: currentUserId,
                }
              : c
          )
        )
      } else {
        alert(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    }
  }

  // Handle back on mobile
  const handleBack = () => {
    setShowMobileChat(false)
    setSelectedConversation(null)
  }

  if (!currentUserId) {
    return null
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
      </div>

      {/* Two-Panel Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Left Panel - Conversations List */}
            <div
              className={`border-r border-gray-200 bg-white ${
                showMobileChat ? 'hidden lg:block' : 'block'
              }`}
            >
              {loading ? (
                <ConversationListSkeleton />
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedConversationId={selectedConversation?.id || null}
                  onSelectConversation={handleSelectConversation}
                  currentUserId={currentUserId}
                />
              )}
            </div>

            {/* Right Panel - Chat Window */}
            <div
              className={`lg:col-span-2 bg-white ${
                showMobileChat ? 'block' : 'hidden lg:block'
              }`}
            >
              {selectedConversation ? (
                <ChatWindow
                  listingId={selectedConversation.listing_id}
                  listingTitle={selectedConversation.listing_title}
                  listingImage={selectedConversation.listing_image}
                  listingStatus={selectedConversation.listing_status}
                  otherUserId={selectedConversation.other_user_id}
                  otherUserName={selectedConversation.other_user_name}
                  otherUserPicture={selectedConversation.other_user_picture}
                  currentUserId={currentUserId}
                  initialMessages={messages}
                  onSendMessage={handleSendMessage}
                  onBack={handleBack}
                />
              ) : (
                <ChatWindowEmpty />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
