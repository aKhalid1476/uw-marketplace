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
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default('No description provided'),
  category: z.string().min(1, 'Category is required'),
})

export async function POST(request: NextRequest) {
  try {
    console.log('[AI-PRICE] Request received')

    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      console.log('[AI-PRICE] Authentication failed')
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      )
    }

    console.log('[AI-PRICE] User authenticated:', user.email)

    // Parse and validate request body
    const body = await request.json()
    const validation = suggestPriceSchema.safeParse(body)

    if (!validation.success) {
      console.log('[AI-PRICE] Validation failed:', validation.error.issues)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Invalid request data',
        },
        { status: 400 }
      )
    }

    const { title, description, category } = validation.data
    console.log('[AI-PRICE] Analyzing price for:', { title, category, hasDescription: !!description })

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
      console.log('[AI-PRICE] AI pricing failed:', result.error)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: result.error || 'Failed to generate price suggestion',
        },
        { status: 500 }
      )
    }

    const { recommendation } = result
    console.log('[AI-PRICE] Price suggested successfully:', recommendation.recommendedPrice)

    // Return price suggestion with additional context
    return NextResponse.json<
      ApiResponse<{
        recommendedPrice: number
        suggestedPrice: number  // Add for backward compatibility
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
          suggestedPrice: recommendation.recommendedPrice,  // Add for frontend compatibility
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
