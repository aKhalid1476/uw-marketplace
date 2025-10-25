/**
 * Database Type Definitions
 *
 * These types correspond to the Supabase database schema.
 * They can be auto-generated using: supabase gen types typescript
 *
 * For now, these are manually defined based on schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          profile_picture_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          profile_picture_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      verification_codes: {
        Row: {
          id: string
          email: string
          code: string
          expires_at: string
          created_at: string
          used: boolean
        }
        Insert: {
          id?: string
          email: string
          code: string
          expires_at: string
          created_at?: string
          used?: boolean
        }
        Update: {
          id?: string
          email?: string
          code?: string
          expires_at?: string
          created_at?: string
          used?: boolean
        }
      }
      listings: {
        Row: {
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
        Insert: {
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
        Update: {
          id?: string
          seller_id?: string
          title?: string
          description?: string | null
          price?: number
          category?: string
          image_urls?: string[]
          status?: 'active' | 'sold' | 'deleted'
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          listing_id: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      price_history: {
        Row: {
          id: string
          listing_id: string
          category: string
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          category: string
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          category?: string
          price?: number
          created_at?: string
        }
      }
    }
    Views: {
      active_listings_with_seller: {
        Row: {
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
          seller_name: string | null
          seller_picture: string | null
        }
      }
      message_threads: {
        Row: {
          id: string
          listing_id: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
          created_at: string
          listing_title: string
          sender_name: string | null
          receiver_name: string | null
        }
      }
    }
    Functions: {
      cleanup_expired_verification_codes: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      listing_status: 'active' | 'sold' | 'deleted'
    }
  }
}

// Helper types for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type VerificationCode = Database['public']['Tables']['verification_codes']['Row']
export type VerificationCodeInsert = Database['public']['Tables']['verification_codes']['Insert']
export type VerificationCodeUpdate = Database['public']['Tables']['verification_codes']['Update']

export type Listing = Database['public']['Tables']['listings']['Row']
export type ListingInsert = Database['public']['Tables']['listings']['Insert']
export type ListingUpdate = Database['public']['Tables']['listings']['Update']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']
export type MessageUpdate = Database['public']['Tables']['messages']['Update']

export type PriceHistory = Database['public']['Tables']['price_history']['Row']
export type PriceHistoryInsert = Database['public']['Tables']['price_history']['Insert']
export type PriceHistoryUpdate = Database['public']['Tables']['price_history']['Update']

export type ActiveListingWithSeller = Database['public']['Views']['active_listings_with_seller']['Row']
export type MessageThread = Database['public']['Views']['message_threads']['Row']

// Common status types
export type ListingStatus = 'active' | 'sold' | 'deleted'

// Category type (you can expand this based on your needs)
export type Category =
  | 'Textbooks'
  | 'Electronics'
  | 'Furniture'
  | 'Clothing'
  | 'Transportation'
  | 'Housing'
  | 'Services'
  | 'Other'
