/**
 * MobileNav Component
 *
 * Mobile navigation menu with slide-in animation
 */

'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { X, Search, PlusCircle, MessageCircle, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    email: string
    full_name: string | null
    profile_picture_url: string | null
  } | null
  unreadCount: number
}

export function MobileNav({ isOpen, onClose, user, unreadCount }: MobileNavProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        onClose()
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleNavClick = (href: string) => {
    onClose()
    router.push(href)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Slide-in Menu */}
      <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Menu
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* Browse */}
              <button
                onClick={() => handleNavClick('/browse')}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
                <span className="font-medium">Browse</span>
              </button>

              {user ? (
                <>
                  {/* Sell */}
                  <button
                    onClick={() => handleNavClick('/listings/create')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span className="font-medium">Sell</span>
                  </button>

                  {/* Chat */}
                  <button
                    onClick={() => handleNavClick('/chat')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors relative"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">Chat</span>
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-auto h-6 w-6 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </button>

                  <Separator className="my-4" />

                  {/* Profile */}
                  <button
                    onClick={() => handleNavClick('/profile')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </button>

                  {/* User Info */}
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      {user.full_name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <Separator className="my-4" />

                  {/* Sign In */}
                  <button
                    onClick={() => handleNavClick('/login')}
                    className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  >
                    Sign In
                  </button>

                  {/* Get Started */}
                  <button
                    onClick={() => handleNavClick('/login')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-center text-gray-500">
              UW Marketplace
            </p>
            <p className="text-xs text-center text-gray-400">
              For UWaterloo Students
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
