/**
 * Price Insights Component
 *
 * Displays AI-powered price suggestions in a beautiful, informative way
 */

'use client'

import { TrendingUp, TrendingDown, Target, Info, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PriceInsightsProps {
  recommendedPrice: number
  minPrice: number
  maxPrice: number
  reasoning: string
  confidence: 'high' | 'medium' | 'low'
  historicalDataPoints?: number
  onAccept?: (price: number) => void
  className?: string
}

export function PriceInsights({
  recommendedPrice,
  minPrice,
  maxPrice,
  reasoning,
  confidence,
  historicalDataPoints = 0,
  onAccept,
  className = '',
}: PriceInsightsProps) {
  const confidenceColors = {
    high: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-orange-100 text-orange-800 border-orange-200',
  }

  const confidenceLabels = {
    high: 'High Confidence',
    medium: 'Medium Confidence',
    low: 'Low Confidence',
  }

  return (
    <Card className={`border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Price Suggestion
            </CardTitle>
            <CardDescription>
              Based on {historicalDataPoints > 0 ? `${historicalDataPoints} similar items` : 'market analysis'}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={confidenceColors[confidence]}
          >
            {confidenceLabels[confidence]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Recommended Price - Large Display */}
        <div className="text-center py-6 bg-white rounded-lg border-2 border-purple-200">
          <div className="text-sm font-medium text-gray-600 mb-2 flex items-center justify-center gap-2">
            <Target className="h-4 w-4" />
            Recommended Price
          </div>
          <div className="text-5xl font-bold text-purple-600">
            ${recommendedPrice.toFixed(2)}
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-4">
          {/* Minimum Price */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <TrendingDown className="h-4 w-4 text-blue-500" />
              Minimum
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              ${minPrice.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Quick sale price
            </div>
          </div>

          {/* Maximum Price */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Maximum
            </div>
            <div className="text-2xl font-semibold text-gray-900">
              ${maxPrice.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Premium price
            </div>
          </div>
        </div>

        {/* Visual Price Range Bar */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Price Range</div>
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
            {/* Range bar */}
            <div
              className="absolute h-full bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 opacity-50"
              style={{ width: '100%' }}
            />
            {/* Recommended price marker */}
            <div
              className="absolute top-0 h-full w-1 bg-purple-600"
              style={{
                left: `${((recommendedPrice - minPrice) / (maxPrice - minPrice)) * 100}%`,
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Recommended
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>${minPrice.toFixed(0)}</span>
            <span>${maxPrice.toFixed(0)}</span>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-900 mb-1">
                AI Analysis
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {onAccept && (
          <button
            onClick={() => onAccept(recommendedPrice)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Target className="h-5 w-5" />
            Use Recommended Price
          </button>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Compact version for inline display
 */
export function PriceInsightsCompact({
  recommendedPrice,
  minPrice,
  maxPrice,
  confidence,
}: Pick<PriceInsightsProps, 'recommendedPrice' | 'minPrice' | 'maxPrice' | 'confidence'>) {
  const confidenceColors = {
    high: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="flex items-center gap-4 py-3 px-4 bg-purple-50 rounded-lg border border-purple-200">
      <Sparkles className="h-5 w-5 text-purple-600" />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">
          AI Suggests: <span className="text-purple-600 font-bold">${recommendedPrice.toFixed(2)}</span>
        </div>
        <div className="text-xs text-gray-500">
          Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
        </div>
      </div>
      <Badge className={confidenceColors[confidence]}>
        {confidence}
      </Badge>
    </div>
  )
}

/**
 * Price comparison component
 */
export function PriceComparison({
  yourPrice,
  recommendedPrice,
  className = '',
}: {
  yourPrice: number
  recommendedPrice: number
  className?: string
}) {
  const difference = yourPrice - recommendedPrice
  const percentDiff = ((difference / recommendedPrice) * 100).toFixed(1)
  const isHigher = difference > 0
  const isLower = difference < 0

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="text-sm text-gray-600">
        Your price: <span className="font-semibold text-gray-900">${yourPrice.toFixed(2)}</span>
      </div>

      {isHigher && (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <TrendingUp className="h-3 w-3 mr-1" />
          {percentDiff}% above AI suggestion
        </Badge>
      )}

      {isLower && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <TrendingDown className="h-3 w-3 mr-1" />
          {Math.abs(Number(percentDiff))}% below AI suggestion
        </Badge>
      )}

      {!isHigher && !isLower && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Target className="h-3 w-3 mr-1" />
          Perfect match!
        </Badge>
      )}
    </div>
  )
}
