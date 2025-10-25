/**
 * Listing Grid Component
 *
 * Responsive grid layout for displaying listing cards
 */

'use client'

import { ListingCard, ListingCardSkeleton, EmptyListings } from './ListingCard'
import type { ListingCard as ListingCardType } from '@/types'

interface ListingGridProps {
  listings: ListingCardType[]
  loading?: boolean
  emptyMessage?: string
  showAIBadge?: boolean
}

export function ListingGrid({
  listings,
  loading = false,
  emptyMessage = 'No listings found',
  showAIBadge = false,
}: ListingGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return <EmptyListings message={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          showAIBadge={showAIBadge}
        />
      ))}
    </div>
  )
}

/**
 * Grid with section header
 */
export function ListingSection({
  title,
  description,
  listings,
  loading = false,
  emptyMessage = 'No listings in this section',
  showViewAll = false,
  viewAllHref,
  showAIBadge = false,
}: ListingGridProps & {
  title: string
  description?: string
  showViewAll?: boolean
  viewAllHref?: string
}) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>

        {showViewAll && viewAllHref && listings.length > 0 && (
          <a
            href={viewAllHref}
            className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
          >
            View all →
          </a>
        )}
      </div>

      {/* Grid */}
      <ListingGrid
        listings={listings}
        loading={loading}
        emptyMessage={emptyMessage}
        showAIBadge={showAIBadge}
      />
    </section>
  )
}
