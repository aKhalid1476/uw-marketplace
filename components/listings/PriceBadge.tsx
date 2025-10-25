/**
 * Price Badge Component
 *
 * Displays price in a visually appealing badge format
 */

'use client'

import { DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceBadgeProps {
  price: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success'
  className?: string
}

export function PriceBadge({
  price,
  size = 'md',
  variant = 'default',
  className = '',
}: PriceBadgeProps) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-lg px-3 py-1.5',
    lg: 'text-2xl px-4 py-2',
  }

  const variantClasses = {
    default: 'bg-gray-100 text-gray-900 border-gray-200',
    primary: 'bg-purple-100 text-purple-900 border-purple-200',
    success: 'bg-green-100 text-green-900 border-green-200',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 font-bold rounded-lg border-2',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <DollarSign className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
      {price.toFixed(2)}
    </div>
  )
}

/**
 * Compact price display (no badge styling)
 */
export function PriceText({
  price,
  className = '',
}: {
  price: number
  className?: string
}) {
  return (
    <span className={cn('font-bold text-gray-900', className)}>
      ${price.toFixed(2)}
    </span>
  )
}
