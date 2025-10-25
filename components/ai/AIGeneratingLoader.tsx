/**
 * AI Generating Loader Component
 *
 * An animated, fun loading state displayed while AI is generating content
 */

'use client'

import { Sparkles, Brain, Wand2 } from 'lucide-react'

interface AIGeneratingLoaderProps {
  message?: string
  type?: 'description' | 'price' | 'general'
}

export function AIGeneratingLoader({
  message,
  type = 'general',
}: AIGeneratingLoaderProps) {
  // Default messages based on type
  const defaultMessages = {
    description: 'Claude is analyzing your image...',
    price: 'Analyzing market data and pricing trends...',
    general: 'AI is thinking...',
  }

  const displayMessage = message || defaultMessages[type]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Animated Icon */}
      <div className="relative mb-6">
        {/* Pulsing background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-purple-500/20 animate-ping" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-20 w-20 rounded-full bg-purple-500/30 animate-ping"
            style={{ animationDelay: '0.2s' }}
          />
        </div>

        {/* Main icon */}
        <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
          {type === 'description' && (
            <Wand2 className="h-8 w-8 text-white animate-pulse" />
          )}
          {type === 'price' && (
            <Brain className="h-8 w-8 text-white animate-pulse" />
          )}
          {type === 'general' && (
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          )}
        </div>

        {/* Orbiting sparkles */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
          <Sparkles className="h-4 w-4 text-purple-500 absolute top-0 left-1/2 -translate-x-1/2" />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center animate-spin-slow"
          style={{ animationDelay: '0.3s' }}
        >
          <Sparkles className="h-3 w-3 text-pink-500 absolute bottom-0 left-1/2 -translate-x-1/2" />
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {displayMessage}
        </h3>

        {/* Animated dots */}
        <div className="flex items-center justify-center space-x-1">
          <div
            className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          />
        </div>

        {/* Fun AI-related messages */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-md">
          {type === 'description' && '✨ Powered by Claude 3.5 Sonnet with vision'}
          {type === 'price' && '🤖 Analyzing historical marketplace data'}
          {type === 'general' && '🧠 AI magic in progress'}
        </p>
      </div>
    </div>
  )
}

/**
 * Inline variant for smaller spaces
 */
export function AIGeneratingLoaderInline({
  message = 'Generating...',
}: {
  message?: string
}) {
  return (
    <div className="flex items-center space-x-3 py-4">
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {message}
        </span>
        <div className="flex space-x-1">
          <div
            className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton loader for AI content
 */
export function AIContentSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
    </div>
  )
}
