import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getBody, queryValue, requireAdmin, sendJson, withApi } from '../../src/http.js'
import { mapBuilding } from '../../src/mappers.js'
import { buildingInsert } from '../../src/payloads.js'
import { getSupabase, throwDatabaseError, throwWriteError } from '../../src/supabase.js'
import type { BuildingRow } from '../../src/types.js'
import { buildingCreateSchema, paginationSchema } from '../../src/validation.js'

async function listBuildings(req: VercelRequest, res: VercelResponse): Promise<void> {
  const params = paginationSchema.parse({
    limit: queryValue(req, 'limit'),
    offset: queryValue(req, 'offset'),
  })

  const { data, error, count } = await getSupabase()
    .from('buildings')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(params.offset, params.offset + params.limit - 1)

  if (error) {
    throwDatabaseError(error)
  }

  const rows = (data ?? []) as BuildingRow[]

  sendJson(res, 200, {
    data: rows.map(mapBuilding),
    meta: {
      total: count ?? rows.length,
      limit: params.limit,
      offset: params.offset,
    },
  })
}

async function createBuilding(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const input = buildingCreateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('buildings')
    .insert(buildingInsert(input))
    .select('*')
    .single()

  if (error) {
    throwWriteError(error)
  }

  sendJson(res, 201, { data: mapBuilding(data as BuildingRow) })
}

export default withApi(['GET', 'POST'], async (req, res) => {
  if (req.method === 'POST') {
    await createBuilding(req, res)
    return
  }

  await listBuildings(req, res)
})