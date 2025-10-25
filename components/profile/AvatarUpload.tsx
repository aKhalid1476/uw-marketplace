/**
 * AvatarUpload Component
 *
 * Allows users to upload and change their profile picture
 * For demo purposes, uses a simple URL input instead of actual file upload
 */

'use client'

import { useState } from 'react'
import { Camera, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AvatarUploadProps {
  userId: string
  onUploadComplete?: (newAvatarUrl: string) => void
}

export function AvatarUpload({ userId, onUploadComplete }: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!avatarUrl.trim()) {
      setError('Please enter an image URL')
      return
    }

    // Basic URL validation
    try {
      new URL(avatarUrl)
    } catch {
      setError('Please enter a valid URL')
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
          profile_picture_url: avatarUrl.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (onUploadComplete) {
          onUploadComplete(data.user.profile_picture_url)
        }
        setIsOpen(false)
        setAvatarUrl('')
      } else {
        setError(data.error || 'Failed to update avatar')
      }
    } catch (err) {
      setError('An error occurred while updating avatar')
      console.error('Avatar update error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_picture_url: null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (onUploadComplete) {
          onUploadComplete('')
        }
        setIsOpen(false)
        setAvatarUrl('')
      } else {
        setError(data.error || 'Failed to remove avatar')
      }
    } catch (err) {
      setError('An error occurred while removing avatar')
      console.error('Avatar remove error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100">
          <Camera className="h-5 w-5" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Enter an image URL to set as your profile picture. For demo purposes, you can use any publicly accessible image URL.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar-url">Image URL</Label>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-gray-400" />
              <Input
                id="avatar-url"
                type="text"
                placeholder="https://example.com/image.jpg"
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value)
                  setError(null)
                }}
                disabled={isLoading}
                className="flex-1"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Preview */}
          {avatarUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="flex justify-center">
                <img
                  src={avatarUrl}
                  alt="Preview"
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-purple-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    setError('Failed to load image from URL')
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = 'block'
                  }}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={isLoading}
            >
              Remove Avatar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !avatarUrl}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? 'Updating...' : 'Update Avatar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
