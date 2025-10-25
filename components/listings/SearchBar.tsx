/**
 * Search Bar Component
 *
 * Search functionality for filtering listings
 */

'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Search listings...',
  defaultValue = '',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [debouncedQuery, setDebouncedQuery] = useState(defaultValue)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleClear = () => {
    setQuery('')
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

        {/* Input */}
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base border-2 focus:border-purple-400 focus:ring-purple-400"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search hint */}
      {query && (
        <div className="absolute top-full left-0 mt-2 text-sm text-gray-600">
          Searching for &quot;{query}&quot;...
        </div>
      )}
    </div>
  )
}

/**
 * Search bar with advanced filters toggle
 */
export function SearchBarWithFilters({
  onSearch,
  onToggleFilters,
  showFilters = false,
  placeholder = 'Search listings...',
  className = '',
}: SearchBarProps & {
  onToggleFilters?: () => void
  showFilters?: boolean
}) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className={cn('flex gap-2', className)}>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base border-2 focus:border-purple-400 focus:ring-purple-400"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {onToggleFilters && (
        <button
          onClick={onToggleFilters}
          className={cn(
            'px-4 py-2 rounded-lg font-medium border-2 transition-colors h-12',
            showFilters
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
          )}
        >
          Filters
        </button>
      )}
    </div>
  )
}
