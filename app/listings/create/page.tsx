/**
 * Create Listing Page
 *
 * Allows users to create a new marketplace listing with:
 * - Image upload
 * - AI-generated descriptions
 * - AI-powered price suggestions
 * - Category selection
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, Sparkles, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const categories = [
  'Electronics',
  'Furniture',
  'Books',
  'Clothing',
  'Tickets',
  'Other',
]

export default function CreateListingPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setImageFile(file)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImagePreview(result)
      setImageBase64(result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageBase64(null)
  }

  const handleGenerateDescription = async () => {
    if (!imageBase64) {
      setError('Please upload an image first')
      return
    }

    setAiLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: imageBase64 }),
      })

      const data = await response.json()
      console.log('AI Response:', data)

      if (data.success) {
        setDescription(data.data?.description || data.description)
      } else {
        setError(data.error || 'Failed to generate description')
        console.error('AI Error Response:', data)
      }
    } catch (err) {
      setError('An error occurred while generating description')
      console.error('AI description error:', err)
    } finally {
      setAiLoading(false)
    }
  }

  const handleSuggestPrice = async () => {
    if (!category) {
      setError('Please select a category first')
      return
    }

    setAiLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/suggest-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          title: title || 'Item',
          description: description || '',
        }),
      })

      const data = await response.json()

      if (data.success && data.suggestedPrice) {
        setPrice(data.suggestedPrice.toString())
      } else {
        setError(data.error || 'Failed to suggest price')
      }
    } catch (err) {
      setError('An error occurred while suggesting price')
      console.error('AI price error:', err)
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          category,
          image_urls: imageBase64 ? [imageBase64] : [],
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/listing/${data.listing.id}`)
        }, 1500)
      } else {
        setError(data.error || 'Failed to create listing')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Create listing error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/browse"
            className="inline-flex items-center text-gray-600 hover:text-purple-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create a Listing</h1>
          <p className="text-gray-600 mt-2">
            List your item for sale on UW Marketplace
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="imageFile">
                Item Image <span className="text-gray-500">(Optional)</span>
              </Label>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageFile"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., iPhone 13 Pro - Like New"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                {imageBase64 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleGenerateDescription}
                    disabled={aiLoading || loading}
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {aiLoading ? 'Generating...' : 'AI Generate'}
                  </Button>
                )}
              </div>
              <Textarea
                id="description"
                placeholder="Describe your item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading || aiLoading}
                rows={6}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>
                Category <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      category === cat
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="price">
                  Price (CAD) <span className="text-red-500">*</span>
                </Label>
                {category && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleSuggestPrice}
                    disabled={aiLoading || loading}
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {aiLoading ? 'Analyzing...' : 'AI Suggest Price'}
                  </Button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-7"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                Listing created successfully! Redirecting...
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !title || !category || !price}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* AI Features Info */}
        <Card className="mt-6 p-4 bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">
                AI-Powered Features
              </h3>
              <p className="text-sm text-purple-700">
                Upload an image to automatically generate a description using Claude
                AI. Select a category to get AI-powered price suggestions based on
                historical data.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
