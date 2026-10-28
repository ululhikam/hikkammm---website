import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  ApiError,
  getBody,
  queryValue,
  requireAdmin,
  sendJson,
  withApi,
} from '../../src/http.js'
import { mapProject } from '../../src/mappers.js'
import { projectPatch } from '../../src/payloads.js'
import { getSupabase, throwDatabaseError, throwWriteError } from '../../src/supabase.js'
import type { ProjectRow } from '../../src/types.js'
import { projectUpdateSchema } from '../../src/validation.js'

function getSlug(req: VercelRequest): string {
  const slug = queryValue(req, 'slug')

  if (!slug) {
    throw new ApiError(404, 'not_found', 'Project tidak ditemukan')
  }

  return slug
}

async function getProject(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { data, error } = await getSupabase()
    .from('projects')
    .select('*')
    .eq('slug', getSlug(req))
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Project tidak ditemukan')
  }

  sendJson(res, 200, { data: mapProject(data as ProjectRow) })
}

async function updateProject(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const slug = getSlug(req)
  const input = projectUpdateSchema.parse(getBody(req))

  const { data, error } = await getSupabase()
    .from('projects')
    .update(projectPatch(input))
    .eq('slug', slug)
    .select('*')
    .maybeSingle()

  if (error) {
    throwWriteError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Project tidak ditemukan')
  }

  sendJson(res, 200, { data: mapProject(data as ProjectRow) })
}

async function deleteProject(req: VercelRequest, res: VercelResponse): Promise<void> {
  requireAdmin(req)

  const { data, error } = await getSupabase()
    .from('projects')
    .delete()
    .eq('slug', getSlug(req))
    .select('id')
    .maybeSingle()

  if (error) {
    throwDatabaseError(error)
  }

  if (!data) {
    throw new ApiError(404, 'not_found', 'Project tidak ditemukan')
  }

  res.status(204).end()
}

export default withApi(['GET', 'PATCH', 'DELETE'], async (req, res) => {
  if (req.method === 'PATCH') {
    await updateProject(req, res)
    return
  }

  if (req.method === 'DELETE') {
    await deleteProject(req, res)
    return
  }

  await getProject(req, res)
})