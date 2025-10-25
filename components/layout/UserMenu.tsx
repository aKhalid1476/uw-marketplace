/**
 * UserMenu Component
 *
 * Dropdown menu for authenticated users with profile and logout options
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, Package } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface UserMenuProps {
  user: {
    id: string
    email: string
    full_name: string | null
    profile_picture_url: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        // Dispatch custom event to notify Header
        window.dispatchEvent(new Event('user-logout'))

        // Redirect to home page
        router.push('/')
        router.refresh()
      } else {
        console.error('Logout failed:', data.error)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string | null, email: string): string => {
    if (name) {
      const names = name.split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  const displayName = user.full_name || user.email.split('@')[0]
  const initials = getInitials(user.full_name, user.email)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-purple-100 hover:ring-purple-300 transition-all"
        >
          <Avatar className="h-10 w-10">
            {user.profile_picture_url && (
              <AvatarImage
                src={user.profile_picture_url}
                alt={displayName}
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push('/profile')}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/listings/my-listings')}
          className="cursor-pointer"
        >
          <Package className="mr-2 h-4 w-4" />
          <span>My Listings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push('/settings')}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
