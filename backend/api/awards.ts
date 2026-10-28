import { queryValue, sendJson, withApi } from '../src/http'
import { mapAward } from '../src/mappers'
import { getSupabase, throwDatabaseError } from '../src/supabase'
import type { AwardRow } from '../src/types'
import { paginationSchema } from '../src/validation'

export default withApi(['GET'], async (req, res) => {
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
})
