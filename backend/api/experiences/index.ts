import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getBody, queryValue, requireAdmin, sendJson, withApi } from '../../src/http.js'
import { mapExperience } from '../../src/mappers.js'
import { experienceInsert } from '../../src/payloads.js'
import { getSupabase, throwDatabaseError, throwWriteError } from '../../src/supabase.js'
import type { ExperienceRow } from '../../src/types.js'
import { experienceCreateSchema, paginationSchema } from '../../src/validation.js'

async function listExperiences(req: VercelRequest, res: VercelResponse): Promise<void> {
  const params = paginationSchema.parse({
    limit: queryValue(req, 'limit'),
    offset: queryValue(req, 'offset'),
  })

  const { data, error, count } = await getSupabase()
    .from('experiences')
    .select('*', { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(params.offset, params.offset + params.limit - 1)

  if (error) {
    throwDatabaseError(error)
  }

  const rows = (data ?? []) as ExperienceRow[]

  sendJson(res, 200, {
    data: rows.map(mapExperience),
    meta: {
      total: count ?? rows.length,
      limit: params.limit,
      offset: params.offset,
    },
  })
}

async function createExperience(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const input = experienceCreateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('experiences')
    .insert(experienceInsert(input))
    .select('*')
    .single()

  if (error) {
    throwWriteError(error)
  }

  sendJson(res, 201, { data: mapExperience(data as ExperienceRow) })
}

export default withApi(['GET', 'POST'], async (req, res) => {
  if (req.method === 'POST') {
    await createExperience(req, res)
    return
  }

  await listExperiences(req, res)
})