import { ApiError, queryValue, sendJson, withApi } from '../../src/http'
import { mapProject } from '../../src/mappers'
import { getSupabase, throwDatabaseError } from '../../src/supabase'
import type { ProjectRow } from '../../src/types'

export default withApi(['GET'], async (req, res) => {
  const slug = queryValue(req, 'slug')

  if (!slug) {
    throw new ApiError(404, 'not_found', 'Project tidak ditemukan')
  }

  const { data, error } = await getSupabase()
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Project tidak ditemukan')
  }

  sendJson(res, 200, { data: mapProject(data as ProjectRow) })
})
