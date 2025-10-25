/**
 * 404 Not Found Page
 *
 * Friendly error page for missing routes
 */

'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Button>
          </Link>

          <Link href="/browse">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-semibold"
            >
              <Search className="mr-2 h-5 w-5" />
              Browse Listings
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Looking for something?</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/browse"
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              Browse Listings
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/chat"
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              Messages
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/listings/create"
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              Sell an Item
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/help"
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              Help Center
            </Link>
          </div>
        </div>

        {/* Back to Previous */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back to previous page
          </button>
        </div>
      </div>
    </div>
  )
}
