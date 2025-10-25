/**
 * Anthropic Claude AI Utilities
 *
 * This file contains helper functions for interacting with Claude AI:
 * - Image analysis for generating descriptions
 * - Price analysis and recommendations
 */

import Anthropic from '@anthropic-ai/sdk'
import type { PriceHistory } from '@/types'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Model configuration
const MODEL = 'claude-sonnet-4-5-20250929'
const MAX_TOKENS = 1024

// =====================================================
// IMAGE ANALYSIS
// =====================================================

/**
 * Analyze an image and generate a marketplace listing description
 * @param imageUrl - URL of the image to analyze
 * @returns Generated description
 */
export async function analyzeImage(imageUrl: string): Promise<{
  success: boolean
  description?: string
  error?: string
}> {
  try {
    // Fetch the image and convert to base64
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch image')
    }

    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    // Determine media type from URL or response
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const mediaType = contentType.includes('png')
      ? 'image/png'
      : contentType.includes('webp')
      ? 'image/webp'
      : contentType.includes('gif')
      ? 'image/gif'
      : 'image/jpeg'

    // Create the message with vision
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `You are helping university students create marketplace listings. Analyze this image and generate an enticing 2-3 sentence description that would appeal to UWaterloo students. Be specific about the item's condition, features, and benefits. Keep it casual but professional.

Focus on:
- What the item is
- Its condition (excellent, good, lightly used, etc.)
- Key features or benefits
- Why a student would want it

Just return the description text, nothing else.`,
            },
          ],
        },
      ],
    })

    // Extract the text response
    const textContent = message.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    return {
      success: true,
      description: textContent.text.trim(),
    }
  } catch (error) {
    console.error('Image analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze image',
    }
  }
}

/**
 * Analyze an image from a local file path or buffer
 * @param imageData - Base64 encoded image data
 * @param mediaType - Image media type
 * @returns Generated description
 */
export async function analyzeImageData(
  imageData: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
): Promise<{
  success: boolean
  description?: string
  error?: string
}> {
  try {
    // Strip data URL prefix if present and detect media type
    let base64Data = imageData
    let detectedMediaType = mediaType

    if (imageData.startsWith('data:')) {
      // Extract media type from data URL (e.g., "data:image/png;base64,...")
      const matches = imageData.match(/^data:(image\/[^;]+);base64,(.+)$/)
      if (matches) {
        detectedMediaType = matches[1] as typeof mediaType
        base64Data = matches[2]
      } else {
        // Fallback: just split by comma
        base64Data = imageData.split(',')[1]
      }
    }

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: detectedMediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `You are helping university students create marketplace listings. Analyze this image and generate an enticing 2-3 sentence description that would appeal to UWaterloo students. Be specific about the item's condition, features, and benefits. Keep it casual but professional.

Focus on:
- What the item is
- Its condition (excellent, good, lightly used, etc.)
- Key features or benefits
- Why a student would want it

Just return the description text, nothing else.`,
            },
          ],
        },
      ],
    })

    const textContent = message.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    return {
      success: true,
      description: textContent.text.trim(),
    }
  } catch (error) {
    console.error('Image analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze image',
    }
  }
}

// =====================================================
// PRICE ANALYSIS
// =====================================================

/**
 * Pricing recommendation result
 */
export interface PricingRecommendation {
  recommendedPrice: number
  minPrice: number
  maxPrice: number
  reasoning: string
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Analyze pricing based on historical data and item details
 * @param title - Item title
 * @param description - Item description
 * @param category - Item category
 * @param historicalPrices - Historical price data for similar items
 * @returns Price recommendation
 */
export async function analyzePricing(
  title: string,
  description: string,
  category: string,
  historicalPrices: PriceHistory[]
): Promise<{
  success: boolean
  recommendation?: PricingRecommendation
  error?: string
}> {
  try {
    // Prepare historical data summary
    let historicalDataText = ''
    let hasHistoricalData = historicalPrices.length > 0

    if (hasHistoricalData) {
      const prices = historicalPrices.map((p) => p.price)
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length
      const minHistorical = Math.min(...prices)
      const maxHistorical = Math.max(...prices)

      historicalDataText = `Historical data for ${category} items (${historicalPrices.length} items):
- Average price: $${avgPrice.toFixed(2)}
- Price range: $${minHistorical.toFixed(2)} - $${maxHistorical.toFixed(2)}
- Individual prices: ${prices.map((p) => `$${p.toFixed(2)}`).join(', ')}`
    } else {
      historicalDataText = `No historical data available for ${category} items in this marketplace.`
    }

    // Create the pricing analysis prompt
    const prompt = `You are a pricing expert for a student marketplace at the University of Waterloo. ${
      hasHistoricalData
        ? `Based on these similar items previously sold:\n\n${historicalDataText}\n\nSuggest a competitive price range for this new item:`
        : `Since there's no historical data, suggest a reasonable price range for this item based on typical student marketplace prices:`
    }

Title: ${title}
Description: ${description}
Category: ${category}

Provide your recommendation in this exact JSON format (no markdown, just raw JSON):
{
  "recommendedPrice": <number>,
  "minPrice": <number>,
  "maxPrice": <number>,
  "reasoning": "<brief explanation>",
  "confidence": "<high/medium/low>"
}

Consider:
- These are used items being sold by students to students
- Students have limited budgets
- Price should be competitive but fair
- ${hasHistoricalData ? 'Use historical data as a strong reference' : 'Estimate based on typical retail value and depreciation'}
${hasHistoricalData ? '- Confidence should be "high" since we have good data' : '- Confidence should be "low" or "medium" without historical data'}`

    // Call Claude
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    // Extract the text response
    const textContent = message.content.find((block) => block.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    // Parse the JSON response
    const responseText = textContent.text.trim()

    // Try to extract JSON if it's wrapped in markdown code blocks
    let jsonText = responseText
    if (responseText.includes('```')) {
      const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
      if (jsonMatch) {
        jsonText = jsonMatch[1]
      }
    }

    const recommendation: PricingRecommendation = JSON.parse(jsonText)

    // Validate the response
    if (
      typeof recommendation.recommendedPrice !== 'number' ||
      typeof recommendation.minPrice !== 'number' ||
      typeof recommendation.maxPrice !== 'number' ||
      typeof recommendation.reasoning !== 'string' ||
      !['high', 'medium', 'low'].includes(recommendation.confidence)
    ) {
      throw new Error('Invalid response format from Claude')
    }

    // Ensure prices are reasonable
    if (
      recommendation.minPrice < 0 ||
      recommendation.maxPrice < recommendation.minPrice ||
      recommendation.recommendedPrice < recommendation.minPrice ||
      recommendation.recommendedPrice > recommendation.maxPrice
    ) {
      throw new Error('Invalid price range in recommendation')
    }

    return {
      success: true,
      recommendation,
    }
  } catch (error) {
    console.error('Price analysis error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze pricing',
    }
  }
}

/**
 * Quick price estimate without historical data
 * @param title - Item title
 * @param description - Item description
 * @param category - Item category
 * @returns Price recommendation
 */
export async function quickPriceEstimate(
  title: string,
  description: string,
  category: string
): Promise<{
  success: boolean
  recommendation?: PricingRecommendation
  error?: string
}> {
  return analyzePricing(title, description, category, [])
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Test the Anthropic API connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Say "Hello"',
        },
      ],
    })

    return message.content.length > 0
  } catch (error) {
    console.error('Connection test failed:', error)
    return false
  }
}

/**
 * Get token count estimate (approximate)
 * @param text - Text to estimate
 * @returns Approximate token count
 */
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4)
}
