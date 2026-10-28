import { randomUUID } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getBody, queryValue, requireAdmin, sendJson, withApi } from '../../src/http.js'
import { mapContactMessage } from '../../src/mappers.js'
import { getSupabase, throwDatabaseError } from '../../src/supabase.js'
import type { ContactMessageRow } from '../../src/types.js'
import {
  contactCreateSchema,
  contactListQuerySchema,
} from '../../src/validation.js'

async function listMessages(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const params = contactListQuerySchema.parse({
    status: queryValue(req, 'status'),
    limit: queryValue(req, 'limit'),
    offset: queryValue(req, 'offset'),
  })

  let query = getSupabase().from('contact_messages').select('*', { count: 'exact' })

  if (params.status) {
    query = query.eq('status', params.status)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(params.offset, params.offset + params.limit - 1)

  if (error) {
    throwDatabaseError(error)
  }

  const rows = (data ?? []) as ContactMessageRow[]

  sendJson(res, 200, {
    data: rows.map(mapContactMessage),
    meta: {
      total: count ?? rows.length,
      limit: params.limit,
      offset: params.offset,
    },
  })
}

async function createMessage(req: VercelRequest, res: VercelResponse): Promise<void> {
  const input = contactCreateSchema.parse(getBody(req))

  // Honeypot: bot biasanya mengisi field yang tidak terlihat.
  if (input.website && input.website.trim().length > 0) {
    sendJson(res, 201, {
      data: { id: randomUUID(), createdAt: new Date().toISOString() },
    })
    return
  }

  const { data, error } = await getSupabase()
    .from('contact_messages')
    .insert({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      status: 'new',
    })
    .select('id, created_at')
    .single()

  if (error) {
    throwDatabaseError(error)
  }

  const created = data as { id: string; created_at: string }

  sendJson(res, 201, {
    data: {
      id: created.id,
      createdAt: created.created_at,
    },
  })
}

export default withApi(['GET', 'POST'], async (req, res) => {
  if (req.method === 'POST') {
    await createMessage(req, res)
    return
  }

  await listMessages(req, res)
})
