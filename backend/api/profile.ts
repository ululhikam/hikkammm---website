import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  ApiError,
  getBody,
  requireAdmin,
  sendJson,
  withApi,
} from '../src/http.js'
import { mapProfile } from '../src/mappers.js'
import { profilePatch } from '../src/payloads.js'
import { getSupabase, throwDatabaseError, throwWriteError } from '../src/supabase.js'
import type { ProfileRow } from '../src/types.js'
import { profileUpdateSchema } from '../src/validation.js'

async function getProfile(res: VercelResponse): Promise<void> {
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
}

async function updateProfile(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const input = profileUpdateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('profile')
    .update(profilePatch(input))
    .eq('id', 1)
    .select('*')
    .maybeSingle()

  if (error) {
    throwWriteError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Profil tidak ditemukan')
  }

  sendJson(res, 200, { data: mapProfile(data as ProfileRow) })
}

export default withApi(['GET', 'PATCH'], async (req, res) => {
  if (req.method === 'PATCH') {
    await updateProfile(req, res)
    return
  }

  await getProfile(res)
})