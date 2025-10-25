/**
 * POST /api/ai/suggest-price
 *
 * Get AI-powered price suggestions based on historical data
 * - Accepts: item title, description, category
 * - Queries price_history table for similar items
 * - Uses Claude 3.5 Sonnet to analyze and suggest pricing
 * - Returns: recommended price, min/max range, reasoning
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'
import { analyzePricing } from '@/lib/anthropic'
import { getCurrentUser } from '@/lib/auth'
import type { ApiResponse, PriceHistory } from '@/types'

// Request validation schema
const suggestPriceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
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
    const validation = suggestPriceSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid request data',
        },
        { status: 400 }
      )
    }

    const { title, description, category } = validation.data

    // Query historical prices for the same category
    const supabase = createServerClient()

    const { data: historicalPrices, error: queryError } = await supabase
      .from('price_history')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(50) // Get last 50 items in this category

    if (queryError) {
      console.error('Failed to query price history:', queryError)
      // Continue without historical data
    }

    const priceHistory: PriceHistory[] = (historicalPrices as PriceHistory[]) || []

    // Get AI price suggestion
    const result = await analyzePricing(title, description, category, priceHistory)

    if (!result.success || !result.recommendation) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: result.error || 'Failed to generate price suggestion',
        },
        { status: 500 }
      )
    }

    const { recommendation } = result

    // Return price suggestion with additional context
    return NextResponse.json<
      ApiResponse<{
        recommendedPrice: number
        minPrice: number
        maxPrice: number
        reasoning: string
        confidence: 'high' | 'medium' | 'low'
        historicalDataPoints: number
      }>
    >(
      {
        success: true,
        data: {
          recommendedPrice: recommendation.recommendedPrice,
          minPrice: recommendation.minPrice,
          maxPrice: recommendation.maxPrice,
          reasoning: recommendation.reasoning,
          confidence: recommendation.confidence,
          historicalDataPoints: priceHistory.length,
        },
        message: 'Price suggestion generated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Suggest price error:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'An unexpected error occurred while generating price suggestion',
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
