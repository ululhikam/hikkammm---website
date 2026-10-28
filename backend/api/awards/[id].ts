import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  ApiError,
  getBody,
  queryValue,
  requireAdmin,
  sendJson,
  withApi,
} from '../../src/http.js'
import { mapAward } from '../../src/mappers.js'
import { awardPatch } from '../../src/payloads.js'
import { getSupabase, throwDatabaseError, throwWriteError } from '../../src/supabase.js'
import type { AwardRow } from '../../src/types.js'
import { awardUpdateSchema, idSchema } from '../../src/validation.js'

function getId(req: VercelRequest): string {
  const id = queryValue(req, 'id')

  if (!id || !idSchema.safeParse(id).success) {
    throw new ApiError(404, 'not_found', 'Award tidak ditemukan')
  }

  return id
}

async function updateAward(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const id = getId(req)
  const input = awardUpdateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('awards')
    .update(awardPatch(input))
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) {
    throwWriteError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Award tidak ditemukan')
  }

  sendJson(res, 200, { data: mapAward(data as AwardRow) })
}

async function deleteAward(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const { data, error } = await getSupabase()
    .from('awards')
    .delete()
    .eq('id', getId(req))
    .select('id')
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Award tidak ditemukan')
  }

  res.status(204).end()
}

export default withApi(['PATCH', 'DELETE'], async (req, res) => {
  if (req.method === 'DELETE') {
    await deleteAward(req, res)
    return
  }

  await updateAward(req, res)
})