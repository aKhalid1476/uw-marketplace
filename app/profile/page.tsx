/**
 * User Profile Page
 *
 * Displays user profile with stats, listings, and edit capabilities
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { UserStats } from '@/components/profile/UserStats'
import { UserListings } from '@/components/profile/UserListings'
import { Separator } from '@/components/ui/separator'

interface User {
  id: string
  email: string
  full_name: string | null
  profile_picture_url: string | null
  created_at: string
}

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

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activeListings, setActiveListings] = useState<Listing[]>([])
  const [soldListings, setSoldListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      // Check authentication
      const authResponse = await fetch('/api/auth/me')
      const authData = await authResponse.json()

      if (!authData.success) {
        router.push('/login')
        return
      }

      setUser(authData.user)

      // Fetch user's listings
      const listingsResponse = await fetch('/api/listings?user=me')
      const listingsData = await listingsResponse.json()

      if (listingsData.success) {
        const active = listingsData.listings.filter(
          (l: Listing) => l.status === 'active'
        )
        const sold = listingsData.listings.filter(
          (l: Listing) => l.status === 'sold'
        )

        setActiveListings(active)
        setSoldListings(sold)
      }
    } catch (err) {
      console.error('Failed to fetch profile data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    )
  }

  // Calculate stats
  const totalListings = activeListings.length + soldListings.length
  const totalRevenue = soldListings.reduce((sum, listing) => sum + listing.price, 0)

  const stats = {
    totalListings,
    activeListings: activeListings.length,
    soldListings: soldListings.length,
    totalRevenue,
    memberSince: user.created_at,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your account and view your marketplace activity
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeader user={user} onUpdate={handleUserUpdate} />

          <Separator />

          {/* Statistics */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Statistics
            </h2>
            <UserStats stats={stats} />
          </div>

          <Separator />

          {/* Listings */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Your Listings
            </h2>
            <UserListings
              activeListings={activeListings}
              soldListings={soldListings}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
