import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  ApiError,
  getBody,
  queryValue,
  requireAdmin,
  sendJson,
  withApi,
} from '../../src/http.js'
import { mapBuilding } from '../../src/mappers.js'
import { buildingPatch } from '../../src/payloads.js'
import { getSupabase, throwDatabaseError, throwWriteError } from '../../src/supabase.js'
import type { BuildingRow } from '../../src/types.js'
import { buildingUpdateSchema } from '../../src/validation.js'

function getSlug(req: VercelRequest): string {
  const slug = queryValue(req, 'slug')

  if (!slug) {
    throw new ApiError(404, 'not_found', 'Building tidak ditemukan')
  }

  return slug
}

async function getBuilding(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { data, error } = await getSupabase()
    .from('buildings')
    .select('*')
    .eq('slug', getSlug(req))
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Building tidak ditemukan')
  }

  sendJson(res, 200, { data: mapBuilding(data as BuildingRow) })
}

async function updateBuilding(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const slug = getSlug(req)
  const input = buildingUpdateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('buildings')
    .update(buildingPatch(input))
    .eq('slug', slug)
    .select('*')
    .maybeSingle()

  if (error) {
    throwWriteError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Building tidak ditemukan')
  }

  sendJson(res, 200, { data: mapBuilding(data as BuildingRow) })
}

async function deleteBuilding(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const { data, error } = await getSupabase()
    .from('buildings')
    .delete()
    .eq('slug', getSlug(req))
    .select('id')
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Building tidak ditemukan')
  }

  res.status(204).end()
}

export default withApi(['GET', 'PATCH', 'DELETE'], async (req, res) => {
  if (req.method === 'PATCH') {
    await updateBuilding(req, res)
    return
  }

  if (req.method === 'DELETE') {
    await deleteBuilding(req, res)
    return
  }

  await getBuilding(req, res)
})