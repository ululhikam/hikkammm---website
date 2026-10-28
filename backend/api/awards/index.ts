import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getBody, queryValue, requireAdmin, sendJson, withApi } from '../../src/http.js'
import { mapAward } from '../../src/mappers.js'
import { awardInsert } from '../../src/payloads.js'
import { getSupabase, throwDatabaseError, throwWriteError } from '../../src/supabase.js'
import type { AwardRow } from '../../src/types.js'
import { awardCreateSchema, paginationSchema } from '../../src/validation.js'

async function listAwards(req: VercelRequest, res: VercelResponse): Promise<void> {
  const params = paginationSchema.parse({
    limit: queryValue(req, 'limit'),
    offset: queryValue(req, 'offset'),
  })

  const { data, error, count } = await getSupabase()
    .from('awards')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(params.offset, params.offset + params.limit - 1)

  if (error) {
    throwDatabaseError(error)
  }

  const rows = (data ?? []) as AwardRow[]

  sendJson(res, 200, {
    data: rows.map(mapAward),
    meta: {
      total: count ?? rows.length,
      limit: params.limit,
      offset: params.offset,
    },
  })
}

async function createAward(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const input = awardCreateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('awards')
    .insert(awardInsert(input))
    .select('*')
    .single()

  if (error) {
    throwWriteError(error)
  }

  sendJson(res, 201, { data: mapAward(data as AwardRow) })
}

export default withApi(['GET', 'POST'], async (req, res) => {
  if (req.method === 'POST') {
    await createAward(req, res)
    return
  }

  await listAwards(req, res)
})