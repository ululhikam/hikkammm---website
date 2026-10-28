import { queryValue, sendJson, withApi } from '../../src/http.js'
import { mapProject } from '../../src/mappers.js'
import { getSupabase, throwDatabaseError } from '../../src/supabase.js'
import type { ProjectRow } from '../../src/types.js'
import { projectQuerySchema } from '../../src/validation.js'

export default withApi(['GET'], async (req, res) => {
  const params = projectQuerySchema.parse({
    category: queryValue(req, 'category'),
    status: queryValue(req, 'status'),
    featured: queryValue(req, 'featured'),
    q: queryValue(req, 'q'),
    limit: queryValue(req, 'limit'),
    offset: queryValue(req, 'offset'),
  })

  let query = getSupabase().from('projects').select('*', { count: 'exact' })

  if (params.category) {
    query = query.ilike('category', params.category)
  }

  if (params.status) {
    query = query.eq('status', params.status)
  }

  if (params.featured !== undefined) {
    query = query.eq('featured', params.featured)
  }

  if (params.q) {
    const term = params.q
      .replace(/[^a-zA-Z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (term) {
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
    }
  }

  const { data, error, count } = await query
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(params.offset, params.offset + params.limit - 1)

  if (error) {
    throwDatabaseError(error)
  }

  const rows = (data ?? []) as ProjectRow[]

  sendJson(res, 200, {
    data: rows.map(mapProject),
    meta: {
      total: count ?? rows.length,
      limit: params.limit,
      offset: params.offset,
    },
  })
})
