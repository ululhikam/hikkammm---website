import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  ApiError,
  getBody,
  queryValue,
  requireAdmin,
  sendJson,
  withApi,
} from '../../src/http.js'
import { mapContactMessage } from '../../src/mappers.js'
import { getSupabase, throwDatabaseError } from '../../src/supabase.js'
import type { ContactMessageRow } from '../../src/types.js'
import { contactUpdateSchema, messageIdSchema } from '../../src/validation.js'

function getId(req: VercelRequest): string {
  const id = queryValue(req, 'id')

  if (!id || !messageIdSchema.safeParse(id).success) {
    throw new ApiError(404, 'not_found', 'Pesan tidak ditemukan')
  }

  return id
}

async function updateMessage(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const input = contactUpdateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('contact_messages')
    .update({ status: input.status })
    .eq('id', getId(req))
    .select('*')
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Pesan tidak ditemukan')
  }

  sendJson(res, 200, { data: mapContactMessage(data as ContactMessageRow) })
}

async function deleteMessage(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const { data, error } = await getSupabase()
    .from('contact_messages')
    .delete()
    .eq('id', getId(req))
    .select('id')
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Pesan tidak ditemukan')
  }

  res.status(204).end()
}

export default withApi(['PATCH', 'DELETE'], async (req, res) => {
  if (req.method === 'DELETE') {
    await deleteMessage(req, res)
    return
  }

  await updateMessage(req, res)
})