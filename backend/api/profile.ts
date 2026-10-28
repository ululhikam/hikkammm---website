import { ApiError, sendJson, withApi } from '../src/http.js'
import { mapProfile } from '../src/mappers.js'
import { getSupabase, throwDatabaseError } from '../src/supabase.js'
import type { ProfileRow } from '../src/types.js'

export default withApi(['GET'], async (_req, res) => {
  const { data, error } = await getSupabase()
    .from('profile')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Profil tidak ditemukan')
  }

  sendJson(res, 200, { data: mapProfile(data as ProfileRow) })
})
