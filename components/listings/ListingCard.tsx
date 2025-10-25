/**
 * Listing Card Component
 *
 * Reusable card for displaying listing preview in grids
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PriceBadge } from './PriceBadge'
import type { ListingCard as ListingCardType } from '@/types'

interface ListingCardProps {
  listing: ListingCardType
  showAIBadge?: boolean
}

export function ListingCard({ listing, showAIBadge = false }: ListingCardProps) {
  const imageUrl = listing.image_url
  const isBase64 = imageUrl?.startsWith('data:image')

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border-2 hover:border-purple-200">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {imageUrl ? (
            isBase64 ? (
              // Use regular img tag for base64 images
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              // Use Next.js Image for external URLs
              <Image
                src={imageUrl}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )
          ) : (
            // Placeholder when no image
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
              <svg className="w-24 h-24 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm text-gray-900 border-white/50"
            >
              {listing.category}
            </Badge>
          </div>

          {/* AI Badge */}
          {showAIBadge && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="bg-purple-500/90 backdrop-blur-sm text-white border-purple-400"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
            </div>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-3 right-3">
            <PriceBadge price={listing.price} variant="primary" />
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
            {listing.title}
          </h3>

          {/* Seller Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
            </div>

            {listing.seller_name && (
              <div className="flex items-center gap-1 truncate">
                <span className="truncate">{listing.seller_name}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/**
 * Skeleton loading state for ListingCard
 */
export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </CardContent>
    </Card>
  )
}

/**
 * Empty state when no listings
 */
export function EmptyListings({ message = 'No listings found' }: { message?: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-400 mb-4">
        <svg
          className="w-24 h-24"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-600 text-center max-w-md">
        Try adjusting your filters or check back later for new listings.
      </p>
    </div>
  )
}
