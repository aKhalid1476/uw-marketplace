/**
 * Landing Page
 *
 * Hero section with feature highlights and CTA buttons
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Sparkles, DollarSign, MessageCircle, Search, ShieldCheck, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
        // Optionally redirect authenticated users directly to browse
        // router.push('/browse')
      }
    } catch (error) {
      // Not authenticated
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/browse')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-40">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-xl">
                <Package className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
              <span className="block text-gray-900">Buy & Sell within the</span>
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                UWaterloo Community
              </span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12">
              A secure marketplace exclusively for UWaterloo students. List items in seconds with AI-powered descriptions and smart pricing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg"
              >
                <Search className="h-5 w-5" />
                {isAuthenticated ? 'Start Browsing' : 'Get Started'}
              </button>

              {!isAuthenticated && (
                <Link href="/browse">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-semibold"
                  >
                    Browse Listings
                  </Button>
                </Link>
              )}

              {isAuthenticated && (
                <Link href="/listings/create">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-semibold"
                  >
                    Sell an Item
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why UW Marketplace?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built by students, for students. Everything you need to buy and sell safely on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: AI Descriptions */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI-Powered Descriptions
              </h3>
              <p className="text-gray-600">
                Upload a photo and let Claude AI generate a detailed, accurate description for your listing in seconds.
              </p>
            </Card>

            {/* Feature 2: Smart Pricing */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Smart Pricing Suggestions
              </h3>
              <p className="text-gray-600">
                Get AI-powered price recommendations based on historical data and similar listings on the platform.
              </p>
            </Card>

            {/* Feature 3: Real-time Chat */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Real-time Messaging
              </h3>
              <p className="text-gray-600">
                Connect with buyers and sellers instantly through our secure, real-time chat powered by Supabase.
              </p>
            </Card>

            {/* Feature 4: UWaterloo Only */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
                <ShieldCheck className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                UWaterloo Students Only
              </h3>
              <p className="text-gray-600">
                Verified @uwaterloo.ca email addresses ensure you're only trading with trusted community members.
              </p>
            </Card>

            {/* Feature 5: Fast & Easy */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fast & Easy Listing
              </h3>
              <p className="text-gray-600">
                Create a listing in under 60 seconds. Upload photos, add AI descriptions, and publish instantly.
              </p>
            </Card>

            {/* Feature 6: Price History */}
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Price History Tracking
              </h3>
              <p className="text-gray-600">
                See historical pricing data for similar items to make informed buying and selling decisions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join hundreds of UWaterloo students buying and selling safely on campus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all rounded-lg"
            >
              {isAuthenticated ? 'Start Browsing' : 'Sign Up with UWaterloo Email'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                100% Free
              </div>
              <p className="text-gray-600">No listing fees or commissions</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                AI-Powered
              </div>
              <p className="text-gray-600">Smart descriptions and pricing</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Campus Only
              </div>
              <p className="text-gray-600">Verified UWaterloo students</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
