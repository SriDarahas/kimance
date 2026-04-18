import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Server-only admin client that bypasses Row Level Security.
 * NEVER expose this on the client side.
 * Used exclusively for admin operations (e.g. reading all transactions).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy_key') as string,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
