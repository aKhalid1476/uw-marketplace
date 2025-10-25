/**
 * Listing Detail Component
 *
 * Complete listing view for detail page
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import {
  MessageCircle,
  CheckCircle,
  Sparkles,
  Clock,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { PriceBadge } from './PriceBadge'
import type { ListingWithSeller } from '@/types'

interface ListingDetailProps {
  listing: ListingWithSeller
  isOwner?: boolean
  onContactSeller?: () => void
  onMarkAsSold?: () => void
  showAIBadge?: boolean
}

export function ListingDetail({
  listing,
  isOwner = false,
  onContactSeller,
  onMarkAsSold,
  showAIBadge = false,
}: ListingDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = listing.image_urls.length > 0 ? listing.image_urls : ['/placeholder-image.jpg']

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={images[currentImageIndex]}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Status Badge */}
          {listing.status === 'sold' && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500 text-white border-green-400 text-lg px-4 py-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                SOLD
              </Badge>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  index === currentImageIndex
                    ? 'ring-4 ring-purple-500'
                    : 'ring-2 ring-gray-200 hover:ring-purple-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${listing.title} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 20vw, 10vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column - Details */}
      <div className="space-y-6">
        {/* Title and Category */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
            {showAIBadge && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-base">
              <Tag className="h-4 w-4 mr-1" />
              {listing.category}
            </Badge>
            <span className="text-gray-500 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Price */}
        <div>
          <PriceBadge price={listing.price} size="lg" variant="primary" />
        </div>

        <Separator />

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {listing.description || 'No description provided.'}
          </p>
        </div>

        <Separator />

        {/* Seller Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={listing.seller_picture || undefined} />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                  {getInitials(listing.seller_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {listing.seller_name || 'Anonymous Seller'}
                </div>
                <div className="text-sm text-gray-600">UWaterloo Student</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          {!isOwner && listing.status === 'active' && (
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={onContactSeller}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Seller
            </Button>
          )}

          {isOwner && listing.status === 'active' && (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 border-green-500 text-green-700 hover:bg-green-50"
              onClick={onMarkAsSold}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark as Sold
            </Button>
          )}

          {listing.status === 'sold' && !isOwner && (
            <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-700">
              This item has been sold
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Loading skeleton for ListingDetail
 */
export function ListingDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />

      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  )
}
