import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Create a Supabase client for use in Client Components
 * This client automatically handles authentication state
 */
export function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Type-safe helper to get the current user
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return user
}

/**
 * Type-safe helper to check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}
