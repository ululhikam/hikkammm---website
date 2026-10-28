import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ApiError } from './http'

let cachedClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (cachedClient) {
    return cachedClient
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new ApiError(
      500,
      'server_misconfigured',
      'SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib dikonfigurasi',
    )
  }

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return cachedClient
}

export function throwDatabaseError(error: { message?: string } | null): never {
  console.error('[supabase]', error?.message ?? error)
  throw new ApiError(500, 'database_error', 'Permintaan database gagal')
}
