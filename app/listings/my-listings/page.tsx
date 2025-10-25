/**
 * My Listings Page
 *
 * Shows all listings created by the current user
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Listing } from '@/types'

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyListings()
  }, [])

  const fetchMyListings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/listings?user=me')

      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }

      const data = await response.json()

      if (data.success) {
        setListings(data.listings || [])
      } else {
        setError(data.error || 'Failed to fetch listings')
      }
    } catch (err) {
      console.error('Fetch listings error:', err)
      setError('An error occurred while fetching your listings')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Remove from local state
        setListings(listings.filter((listing) => listing.id !== id))
      } else {
        alert(data.error || 'Failed to delete listing')
      }
    } catch (err) {
      console.error('Delete listing error:', err)
      alert('An error occurred while deleting the listing')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/browse"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
              <p className="text-gray-600 mt-2">
                Manage your marketplace listings
              </p>
            </div>
            <Button
              onClick={() => router.push('/listings/create')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No listings yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first listing to start selling on UW Marketplace
              </p>
              <Button
                onClick={() => router.push('/listings/create')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </div>
          </Card>
        )}

        {/* Listings Grid */}
        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                {listing.image_urls && listing.image_urls.length > 0 && (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={listing.image_urls[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                      {listing.title}
                    </h3>
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

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-purple-600">
                      ${listing.price.toFixed(2)}
                    </span>
                    <Badge variant="outline">{listing.category}</Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/listing/${listing.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteListing(listing.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
