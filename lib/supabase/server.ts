import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Create a Supabase client for use in Server Components and API Routes
 * Uses the service role key for admin operations
 */
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

/**
 * Create a regular Supabase client for Server Components
 * Uses the anon key (same permissions as client-side)
 */
export function createServerAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
