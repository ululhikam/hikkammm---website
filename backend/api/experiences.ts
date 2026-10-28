import { queryValue, sendJson, withApi } from '../src/http.js'
import { mapExperience } from '../src/mappers.js'
import { getSupabase, throwDatabaseError } from '../src/supabase.js'
import type { ExperienceRow } from '../src/types.js'
import { paginationSchema } from '../src/validation.js'

export default withApi(['GET'], async (req, res) => {
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
})
