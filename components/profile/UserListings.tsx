/**
 * UserListings Component
 *
 * Displays user's active and sold listings with tabs
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, Eye, MessageCircle, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PriceBadge } from '@/components/listings/PriceBadge'

interface Listing {
  id: string
  title: string
  description: string | null
  price: number
  category: string
  image_urls: string[]
  status: 'active' | 'sold' | 'deleted'
  created_at: string
  ai_generated_description: boolean
}

interface UserListingsProps {
  activeListings: Listing[]
  soldListings: Listing[]
}

export function UserListings({ activeListings, soldListings }: UserListingsProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'sold'>('active')

  const currentListings = activeTab === 'active' ? activeListings : soldListings

  const ListingCard = ({ listing }: { listing: Listing }) => {
    const imageUrl = listing.image_urls[0] || '/placeholder-image.jpg'

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-100 flex-shrink-0">
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {listing.status === 'sold' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge className="bg-green-600 text-white">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Sold
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <Link
                  href={`/listing/${listing.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-1"
                >
                  {listing.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {listing.category}
                  </Badge>
                  {listing.ai_generated_description && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                    >
                      AI
                    </Badge>
                  )}
                </div>
              </div>
              <PriceBadge price={listing.price} size="lg" />
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {listing.description || 'No description provided.'}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href={`/listing/${listing.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              {listing.status === 'active' && (
                <Link href={`/chat?listing=${listing.id}`}>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Messages
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'active'
              ? 'text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active Listings
          {activeListings.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-purple-100 text-purple-700"
            >
              {activeListings.length}
            </Badge>
          )}
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('sold')}
          className={`pb-3 px-1 font-medium transition-colors relative ${
            activeTab === 'sold'
              ? 'text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sold Listings
          {soldListings.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 bg-green-100 text-green-700"
            >
              {soldListings.length}
            </Badge>
          )}
          {activeTab === 'sold' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
          )}
        </button>
      </div>

      {/* Listings */}
      {currentListings.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {activeTab} listings
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'active'
                ? "You don't have any active listings yet."
                : "You haven't sold any items yet."}
            </p>
            {activeTab === 'active' && (
              <Link href="/listings/create">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Create Your First Listing
                </Button>
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {currentListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
