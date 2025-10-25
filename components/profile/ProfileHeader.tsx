/**
 * ProfileHeader Component
 *
 * Displays user profile information with edit capability
 */

'use client'

import { useState } from 'react'
import { Calendar, Mail, Edit2, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { AvatarUpload } from './AvatarUpload'

interface ProfileHeaderProps {
  user: {
    id: string
    email: string
    full_name: string | null
    profile_picture_url: string | null
    created_at: string
  }
  onUpdate?: (updatedUser: any) => void
}

export function ProfileHeader({ user, onUpdate }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user.full_name || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError('Name cannot be empty')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsEditing(false)
        if (onUpdate) {
          onUpdate(data.user)
        }
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('An error occurred while updating profile')
      console.error('Profile update error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFullName(user.full_name || '')
    setError(null)
    setIsEditing(false)
  }

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (onUpdate) {
      onUpdate({
        ...user,
        profile_picture_url: newAvatarUrl,
      })
    }
  }

  const displayName = user.full_name || user.email.split('@')[0]
  const initials = getInitials(user.full_name, user.email)
  const memberSince = format(new Date(user.created_at), 'MMMM yyyy')

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative group">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-purple-100">
            {user.profile_picture_url && (
              <AvatarImage
                src={user.profile_picture_url}
                alt={displayName}
              />
            )}
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-3xl sm:text-4xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Avatar Upload Overlay */}
          <AvatarUpload userId={user.id} onUploadComplete={handleAvatarUpdate} />
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left w-full">
          {/* Name Section */}
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="text-lg font-semibold max-w-md"
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {displayName}
              </h1>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Email and Join Date */}
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Member since {memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
