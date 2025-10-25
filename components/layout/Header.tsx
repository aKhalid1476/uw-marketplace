/**
 * Header Component
 *
 * Main navigation header with logo, links, and user menu
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Package, MessageCircle, PlusCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserMenu } from './UserMenu'
import { MobileNav } from './MobileNav'
import { getUnreadCount } from '@/lib/chat'

interface User {
  id: string
  email: string
  full_name: string | null
  profile_picture_url: string | null
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()

    // Listen for custom logout event
    const handleLogout = () => {
      setUser(null)
      setUnreadCount(0)
    }

    window.addEventListener('user-logout', handleLogout)

    return () => {
      window.removeEventListener('user-logout', handleLogout)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      // Poll for unread count every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        // Not authenticated (401, 403, etc.)
        setUser(null)
        return
      }
      const data = await response.json()
      if (data.success) {
        setUser(data.data.user)
      }
    } catch (error) {
      // Not authenticated or network error
      setUser(null)
    }
  }

  const fetchUnreadCount = async () => {
    if (!user) return
    try {
      const count = await getUnreadCount(user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  UW Marketplace
                </h1>
                <p className="text-xs text-gray-600">Waterloo Students</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/browse"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                <Search className="h-4 w-4" />
                Browse
              </Link>

              {user && (
                <>
                  <Link
                    href="/listings/create"
                    className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Sell
                  </Link>

                  <Link
                    href="/chat"
                    className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-colors relative"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Link>
                </>
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/login">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        unreadCount={unreadCount}
      />
    </>
  )
}
