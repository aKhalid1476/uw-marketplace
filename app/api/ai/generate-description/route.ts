/**
 * POST /api/ai/generate-description
 *
 * Generate a marketplace listing description from an image
 * - Accepts image URL or base64 image data
 * - Uses Claude 3.5 Sonnet with vision
 * - Returns AI-generated description
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzeImage, analyzeImageData } from '@/lib/anthropic'
import { getCurrentUser } from '@/lib/auth'
import type { ApiResponse } from '@/types'

// Request validation schema
const generateDescriptionSchema = z.object({
  imageUrl: z.string().url('Invalid image URL').optional(),
  imageData: z.string().optional(),
  mediaType: z
    .enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
    .optional()
    .default('image/jpeg'),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = generateDescriptionSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid request data',
        },
        { status: 400 }
      )
    }

    const { imageUrl, imageData, mediaType } = validation.data

    // Either imageUrl or imageData must be provided
    if (!imageUrl && !imageData) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Either imageUrl or imageData must be provided',
        },
        { status: 400 }
      )
    }

    // Generate description using Claude
    let result

    if (imageUrl) {
      // Analyze image from URL
      result = await analyzeImage(imageUrl)
    } else if (imageData) {
      // Analyze image from base64 data
      result = await analyzeImageData(imageData, mediaType)
    } else {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'No image provided',
        },
        { status: 400 }
      )
    }

    if (!result.success || !result.description) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: result.error || 'Failed to generate description',
        },
        { status: 500 }
      )
    }

    // Return the generated description
    return NextResponse.json<ApiResponse<{ description: string }>>(
      {
        success: true,
        data: {
          description: result.description,
        },
        message: 'Description generated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Generate description error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'An unexpected error occurred while generating description',
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
