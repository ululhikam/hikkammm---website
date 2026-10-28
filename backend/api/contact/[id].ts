import { ApiError, getBody, queryValue, requireAdmin, sendJson, withApi } from '../../src/http'
import { mapContactMessage } from '../../src/mappers'
import { getSupabase, throwDatabaseError } from '../../src/supabase'
import type { ContactMessageRow } from '../../src/types'
import { contactUpdateSchema, messageIdSchema } from '../../src/validation'

export default withApi(['PATCH'], async (req, res) => {
  requireAdmin(req)

  const id = queryValue(req, 'id')

  if (!id || !messageIdSchema.safeParse(id).success) {
    throw new ApiError(404, 'not_found', 'Pesan tidak ditemukan')
  }

  const input = contactUpdateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('contact_messages')
    .update({ status: input.status })
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Pesan tidak ditemukan')
  }

  sendJson(res, 200, { data: mapContactMessage(data as ContactMessageRow) })
})
