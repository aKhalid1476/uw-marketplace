/**
 * Type Definitions for UW Marketplace
 *
 * This file contains all the TypeScript types and enums used throughout the application.
 * These types align with the database schema and provide type safety.
 */

// =====================================================
// ENUMS
// =====================================================

/**
 * Listing status enum
 */
export enum ListingStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  DELETED = 'deleted',
}

/**
 * Category enum for marketplace items
 */
export enum Category {
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  BOOKS = 'Books',
  CLOTHING = 'Clothing',
  TICKETS = 'Tickets',
  OTHER = 'Other',
}

// =====================================================
// USER TYPES
// =====================================================

/**
 * User type - represents a user in the system
 */
export interface User {
  id: string
  email: string
  full_name: string | null
  profile_picture_url: string | null
  created_at: string
  updated_at: string
}

/**
 * User insert type - for creating new users
 */
export interface UserInsert {
  id?: string
  email: string
  full_name?: string | null
  profile_picture_url?: string | null
  created_at?: string
  updated_at?: string
}

/**
 * User update type - for updating existing users
 */
export interface UserUpdate {
  email?: string
  full_name?: string | null
  profile_picture_url?: string | null
  updated_at?: string
}

/**
 * Public user profile - limited info for display
 */
export interface PublicUserProfile {
  id: string
  full_name: string | null
  profile_picture_url: string | null
}

// =====================================================
// VERIFICATION CODE TYPES
// =====================================================

/**
 * Verification code type - for email verification
 */
export interface VerificationCode {
  id: string
  email: string
  code: string
  expires_at: string
  created_at: string
  used: boolean
}

/**
 * Verification code insert type
 */
export interface VerificationCodeInsert {
  id?: string
  email: string
  code: string
  expires_at: string
  created_at?: string
  used?: boolean
}

/**
 * Verification code update type
 */
export interface VerificationCodeUpdate {
  used?: boolean
}

// =====================================================
// LISTING TYPES
// =====================================================

/**
 * Listing type - represents a marketplace listing
 */
export interface Listing {
  id: string
  seller_id: string
  title: string
  description: string | null
  price: number
  category: string
  image_urls: string[]
  status: 'active' | 'sold' | 'deleted'
  created_at: string
  updated_at: string
}

/**
 * Listing insert type - for creating new listings
 */
export interface ListingInsert {
  id?: string
  seller_id: string
  title: string
  description?: string | null
  price: number
  category: string
  image_urls?: string[]
  status?: 'active' | 'sold' | 'deleted'
  created_at?: string
  updated_at?: string
}

/**
 * Listing update type - for updating existing listings
 */
export interface ListingUpdate {
  title?: string
  description?: string | null
  price?: number
  category?: string
  image_urls?: string[]
  status?: 'active' | 'sold' | 'deleted'
  updated_at?: string
}

/**
 * Listing with seller info - enriched listing data
 */
export interface ListingWithSeller extends Listing {
  seller_name: string | null
  seller_picture: string | null
}

/**
 * Listing card data - optimized for display in lists
 */
export interface ListingCard {
  id: string
  title: string
  price: number
  category: string
  image_url: string | null // First image or null
  created_at: string
  seller_name: string | null
}

// =====================================================
// MESSAGE TYPES
// =====================================================

/**
 * Message type - represents a message between users
 */
export interface Message {
  id: string
  listing_id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

/**
 * Message insert type - for creating new messages
 */
export interface MessageInsert {
  id?: string
  listing_id: string
  sender_id: string
  receiver_id: string
  content: string
  read?: boolean
  created_at?: string
}

/**
 * Message update type - for updating existing messages
 */
export interface MessageUpdate {
  read?: boolean
}

/**
 * Message with user info - enriched message data
 */
export interface MessageWithUsers extends Message {
  sender_name: string | null
  sender_picture: string | null
  receiver_name: string | null
  receiver_picture: string | null
}

/**
 * Message thread - represents a conversation
 */
export interface MessageThread {
  id: string
  listing_id: string
  listing_title: string
  other_user_id: string
  other_user_name: string | null
  other_user_picture: string | null
  last_message: string
  last_message_time: string
  unread_count: number
}

// =====================================================
// PRICE HISTORY TYPES
// =====================================================

/**
 * Price history type - for tracking historical prices
 */
export interface PriceHistory {
  id: string
  listing_id: string
  category: string
  price: number
  created_at: string
}

/**
 * Price history insert type
 */
export interface PriceHistoryInsert {
  id?: string
  listing_id: string
  category: string
  price: number
  created_at?: string
}

/**
 * Price statistics - aggregated price data
 */
export interface PriceStatistics {
  category: string
  average_price: number
  median_price: number
  min_price: number
  max_price: number
  count: number
}

/**
 * Price recommendation - AI-generated price suggestion
 */
export interface PriceRecommendation {
  suggested_price: number
  confidence: 'low' | 'medium' | 'high'
  reasoning: string
  comparable_listings: number
  price_range: {
    min: number
    max: number
  }
}

// =====================================================
// FORM TYPES
// =====================================================

/**
 * Email verification request form
 */
export interface EmailVerificationRequest {
  email: string
}

/**
 * Email verification submit form
 */
export interface EmailVerificationSubmit {
  email: string
  code: string
}

/**
 * Create listing form
 */
export interface CreateListingForm {
  title: string
  description: string
  price: number
  category: string
  images: File[]
}

/**
 * Update listing form
 */
export interface UpdateListingForm {
  title?: string
  description?: string
  price?: number
  category?: string
  status?: 'active' | 'sold' | 'deleted'
  images?: File[]
}

/**
 * Send message form
 */
export interface SendMessageForm {
  listing_id: string
  receiver_id: string
  content: string
}

/**
 * Search/filter parameters
 */
export interface ListingFilters {
  category?: string
  min_price?: number
  max_price?: number
  search?: string
  seller_id?: string
  status?: 'active' | 'sold' | 'deleted'
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

/**
 * Success response
 */
export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

/**
 * Error response
 */
export interface ApiError {
  success: false
  error: string
  details?: unknown
}

/**
 * API response type
 */
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// =====================================================
// UTILITY TYPES
// =====================================================

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
