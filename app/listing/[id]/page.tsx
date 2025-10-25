/**
 * Listing Detail Page
 *
 * Shows detailed information about a single listing
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, MessageCircle, User, Calendar, Tag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Listing, User as UserType } from '@/types'

export default function ListingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params?.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [seller, setSeller] = useState<UserType | null>(null)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchListingDetails()
    checkCurrentUser()
  }, [listingId])

  const checkCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCurrentUser(data.data.user)
        }
      }
    } catch (err) {
      console.error('Check auth error:', err)
    }
  }

  const fetchListingDetails = async () => {
    if (!listingId) {
      setError('No listing ID provided')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log('Fetching listing:', listingId)
      const response = await fetch(`/api/listings/${listingId}`)

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API error:', errorData)
        throw new Error(errorData.error || 'Failed to fetch listing')
      }

      const data = await response.json()
      console.log('Listing data:', data)

      if (data.success) {
        setListing(data.listing)
        setSeller(data.seller)
      } else {
        setError(data.error || 'Listing not found')
      }
    } catch (err) {
      console.error('Fetch listing error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the listing')
    } finally {
      setLoading(false)
    }
  }

  const handleContactSeller = () => {
    if (!currentUser) {
      router.push('/login?returnUrl=' + encodeURIComponent(window.location.pathname))
      return
    }

    if (!seller || !listing) return

    // Navigate to chat with this seller and listing
    router.push(`/chat?listing=${listing.id}&user=${seller.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/browse"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Listing Not Found
            </h2>
            <p className="text-gray-600 mb-6">{error || 'This listing does not exist or has been removed.'}</p>
            <Button onClick={() => router.push('/browse')}>
              Back to Browse
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const isOwner = currentUser?.id === listing.seller_id

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Link
          href="/browse"
          className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Image */}
              {listing.image_urls && listing.image_urls.length > 0 ? (
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={listing.image_urls[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Tag className="h-24 w-24 text-purple-300" />
                </div>
              )}

              {/* Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-sm">
                        {listing.category}
                      </Badge>
                      <Badge
                        variant={listing.status === 'active' ? 'default' : 'secondary'}
                        className={
                          listing.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : ''
                        }
                      >
                        {listing.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-600">
                      ${listing.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {listing.description || 'No description provided.'}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Posted {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Seller Information
              </h2>

              {seller ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {seller.profile_picture_url ? (
                      <img
                        src={seller.profile_picture_url}
                        alt={seller.full_name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">
                        {seller.full_name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-600">{seller.email}</div>
                    </div>
                  </div>

                  {!isOwner && (
                    <Button
                      onClick={handleContactSeller}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                  )}

                  {isOwner && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-900">
                      This is your listing
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-600">Seller information not available</div>
              )}
            </Card>

            {/* Safety Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Safety Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Meet in a public place on campus</li>
                <li>• Inspect items before payment</li>
                <li>• Report suspicious listings</li>
                <li>• Use secure payment methods</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
