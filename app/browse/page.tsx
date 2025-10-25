/**
 * Browse Page
 *
 * Main marketplace browsing page with filtering and search
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/listings/SearchBar'
import { CategoryFilter } from '@/components/listings/CategoryFilter'
import { ListingGrid, ListingSection } from '@/components/listings/ListingGrid'
import type { ListingCard } from '@/types'

export default function BrowsePage() {
  const [listings, setListings] = useState<ListingCard[]>([])
  const [myListings, setMyListings] = useState<ListingCard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      setIsAuthenticated(data.success)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/listings?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setListings(data.listings || [])
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, selectedCategory])

  // Fetch user's own listings if authenticated
  const fetchMyListings = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const response = await fetch('/api/listings/my-listings')
      const data = await response.json()

      if (data.success) {
        setMyListings(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch my listings:', error)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  useEffect(() => {
    fetchMyListings()
  }, [fetchMyListings])

  // Calculate category counts
  const categoryCounts = listings.reduce((acc, listing) => {
    acc[listing.category] = (acc[listing.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                UW Marketplace
              </h1>
              <p className="text-gray-600 mt-1">
                Buy and sell with fellow Waterloo students
              </p>
            </div>

            {isAuthenticated && (
              <Link href="/listings/create">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Listing
                </Button>
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search for textbooks, furniture, electronics..."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            counts={categoryCounts}
          />
        </div>

        {/* My Listings Section (if authenticated) */}
        {isAuthenticated && myListings.length > 0 && (
          <div className="mb-12">
            <ListingSection
              title="Your Listings"
              description="Manage your active listings"
              listings={myListings.slice(0, 4)}
              loading={false}
              showViewAll={myListings.length > 4}
              viewAllHref="/listings/my-listings"
              showAIBadge
            />
          </div>
        )}

        {/* All Listings */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory} Listings` : 'All Listings'}
            </h2>
            <p className="text-gray-600 mt-1">
              {listings.length} {listings.length === 1 ? 'item' : 'items'} available
            </p>
          </div>

          <ListingGrid
            listings={listings}
            loading={loading}
            emptyMessage={
              searchQuery
                ? `No listings found for "${searchQuery}"`
                : selectedCategory
                ? `No ${selectedCategory} listings available`
                : 'No listings available yet. Be the first to post!'
            }
            showAIBadge
          />
        </div>

        {/* Call to Action for unauthenticated users */}
        {!isAuthenticated && listings.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-2">
              Ready to start selling?
            </h2>
            <p className="text-lg mb-6 text-purple-100">
              Join UW Marketplace and connect with thousands of students
            </p>
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-purple-50"
              >
                Sign In with UWaterloo Email
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
