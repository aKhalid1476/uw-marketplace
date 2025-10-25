/**
 * Direct Chat Page for Specific Listing
 *
 * Automatically creates conversation if it doesn't exist
 * Direct link from "Contact Seller" button
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChatWindow } from '@/components/chat/ChatWindow'
import type { Message, Listing } from '@/types'

export default function DirectChatPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.listingId as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check authentication
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
        // Redirect to login with return URL
        router.push(`/login?redirect=/chat/${listingId}`)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push(`/login?redirect=/chat/${listingId}`)
    }
  }

  // Fetch listing details
  useEffect(() => {
    if (!listingId || !currentUserId) return

    fetchListing()
  }, [listingId, currentUserId])

  const fetchListing = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/listings/${listingId}`)
      const data = await response.json()

      if (data.success) {
        setListing(data.data)

        // Check if user is trying to message themselves
        if (data.data.seller_id === currentUserId) {
          setError('You cannot message yourself')
          return
        }

        // Fetch existing messages
        await fetchMessages(data.data.seller_id)
      } else {
        setError('Listing not found')
      }
    } catch (error) {
      console.error('Failed to fetch listing:', error)
      setError('Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages
  const fetchMessages = async (sellerId: string) => {
    try {
      const response = await fetch(
        `/api/chat/messages?listing_id=${listingId}&other_user_id=${sellerId}`
      )
      const data = await response.json()

      if (data.success) {
        setMessages(data.data.messages || [])
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  // Handle send message
  const handleSendMessage = async (content: string) => {
    if (!listing || !currentUserId) return

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          receiver_id: listing.seller_id,
          content,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        alert(data.error || 'Failed to send message')
      }
      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message')
    }
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link href="/browse">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading || !listing || !currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  const sellerInfo = listing as any

  return (
    <div className="h-screen flex flex-col">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/browse">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Chat with Seller</h1>
            <p className="text-sm text-gray-600">About: {listing.title}</p>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full">
          <ChatWindow
            listingId={listingId}
            listingTitle={listing.title}
            listingImage={listing.image_urls?.[0] || null}
            listingStatus={listing.status}
            otherUserId={listing.seller_id}
            otherUserName={sellerInfo.seller_name}
            otherUserPicture={sellerInfo.seller_picture}
            currentUserId={currentUserId}
            initialMessages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}
