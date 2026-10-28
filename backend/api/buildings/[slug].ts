import { ApiError, queryValue, sendJson, withApi } from '../../src/http.js'
import { mapBuilding } from '../../src/mappers.js'
import { getSupabase, throwDatabaseError } from '../../src/supabase.js'
import type { BuildingRow } from '../../src/types.js'

export default withApi(['GET'], async (req, res) => {
  const slug = queryValue(req, 'slug')

  if (!slug) {
    throw new ApiError(404, 'not_found', 'Building tidak ditemukan')
  }

  const { data, error } = await getSupabase()
    .from('buildings')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Building tidak ditemukan')
  }

  sendJson(res, 200, { data: mapBuilding(data as BuildingRow) })
})
