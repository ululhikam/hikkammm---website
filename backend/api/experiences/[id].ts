import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  ApiError,
  getBody,
  queryValue,
  requireAdmin,
  sendJson,
  withApi,
} from '../../src/http.js'
import { mapExperience } from '../../src/mappers.js'
import { experiencePatch } from '../../src/payloads.js'
import { getSupabase, throwDatabaseError, throwWriteError } from '../../src/supabase.js'
import type { ExperienceRow } from '../../src/types.js'
import { experienceUpdateSchema, idSchema } from '../../src/validation.js'

function getId(req: VercelRequest): string {
  const id = queryValue(req, 'id')

  if (!id || !idSchema.safeParse(id).success) {
    throw new ApiError(404, 'not_found', 'Experience tidak ditemukan')
  }

  return id
}

async function updateExperience(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const id = getId(req)
  const input = experienceUpdateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('experiences')
    .update(experiencePatch(input))
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) {
    throwWriteError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Experience tidak ditemukan')
  }

  sendJson(res, 200, { data: mapExperience(data as ExperienceRow) })
}

async function deleteExperience(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const { data, error } = await getSupabase()
    .from('experiences')
    .delete()
    .eq('id', getId(req))
    .select('id')
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Experience tidak ditemukan')
  }

  res.status(204).end()
}

export default withApi(['PATCH', 'DELETE'], async (req, res) => {
  if (req.method === 'DELETE') {
    await deleteExperience(req, res)
    return
  }

  await updateExperience(req, res)
})