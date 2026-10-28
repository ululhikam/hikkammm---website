import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ApiError } from './http.js'

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

export function throwWriteError(error: { code?: string; message?: string } | null): never {
  if (error?.code === '23505') {
    throw new ApiError(409, 'conflict', 'Data dengan slug tersebut sudah ada')
  }

  if (error?.code === '23514') {
    throw new ApiError(400, 'validation_error', 'Data tidak memenuhi aturan database')
  }

  throwDatabaseError(error)
}
