/**
 * Category Filter Component
 *
 * Filter buttons for browsing listings by category
 */

'use client'

import { useState } from 'react'
import {
  Laptop,
  Armchair,
  BookOpen,
  Shirt,
  Ticket,
  MoreHorizontal,
  Filter,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Category } from '@/types'

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  counts?: Record<string, number>
}

const CATEGORIES = [
  { value: Category.ELECTRONICS, label: 'Electronics', icon: Laptop, color: 'text-blue-600' },
  { value: Category.FURNITURE, label: 'Furniture', icon: Armchair, color: 'text-orange-600' },
  { value: Category.BOOKS, label: 'Books', icon: BookOpen, color: 'text-green-600' },
  { value: Category.CLOTHING, label: 'Clothing', icon: Shirt, color: 'text-pink-600' },
  { value: Category.TICKETS, label: 'Tickets', icon: Ticket, color: 'text-purple-600' },
  { value: Category.OTHER, label: 'Other', icon: MoreHorizontal, color: 'text-gray-600' },
]

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  counts = {},
}: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter className="h-4 w-4" />
        Filter by Category
      </div>

      {/* All Categories Button */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
            !selectedCategory
              ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
          )}
        >
          All Categories
          {!selectedCategory && Object.values(counts).reduce((a, b) => a + b, 0) > 0 && (
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {Object.values(counts).reduce((a, b) => a + b, 0)}
            </Badge>
          )}
        </button>

        {/* Category Buttons */}
        {CATEGORIES.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.value
          const count = counts[category.value] || 0

          return (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                isSelected
                  ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
              )}
            >
              <Icon className={cn('h-4 w-4', !isSelected && category.color)} />
              {category.label}
              {count > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    isSelected
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  )}
                >
                  {count}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Compact category filter (dropdown version for mobile)
 */
export function CategoryFilterCompact({
  selectedCategory,
  onCategoryChange,
}: Omit<CategoryFilterProps, 'counts'>) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCat = CATEGORIES.find((c) => c.value === selectedCategory)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
      >
        <Filter className="h-4 w-4" />
        {selectedCat ? (
          <>
            <selectedCat.icon className={cn('h-4 w-4', selectedCat.color)} />
            {selectedCat.label}
          </>
        ) : (
          'All Categories'
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => {
                onCategoryChange(null)
                setIsOpen(false)
              }}
              className={cn(
                'w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors',
                !selectedCategory && 'bg-purple-100 font-medium'
              )}
            >
              All Categories
            </button>

            {CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.value}
                  onClick={() => {
                    onCategoryChange(category.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-2',
                    selectedCategory === category.value && 'bg-purple-100 font-medium'
                  )}
                >
                  <Icon className={cn('h-4 w-4', category.color)} />
                  {category.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
