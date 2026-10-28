import { timingSafeEqual } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ZodError } from 'zod'

type ApiHandler = (req: VercelRequest, res: VercelResponse) => Promise<void> | void

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://hikkammm.my.id',
  'https://www.hikkammm.my.id',
  'https://hikam.dev',
  'https://www.hikam.dev',
]

function getAllowedOrigins(): string[] {
  const configured = process.env.CORS_ORIGINS
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return configured && configured.length > 0 ? configured : DEFAULT_ORIGINS
}

function applyCors(req: VercelRequest, res: VercelResponse): void {
  const origin = req.headers.origin

  if (origin && getAllowedOrigins().includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
}

export function sendJson(res: VercelResponse, status: number, payload: unknown): void {
  res.status(status)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.json(payload)
}

function sendError(
  res: VercelResponse,
  status: number,
  code: string,
  message: string,
  details?: unknown,
): void {
  sendJson(res, status, {
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
    },
  })
}

function handleError(res: VercelResponse, error: unknown): void {
  if (error instanceof ZodError) {
    sendError(
      res,
      400,
      'validation_error',
      'Request tidak valid',
      error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    )
    return
  }

  if (error instanceof ApiError) {
    if (error.status >= 500) {
      console.error(`[api] ${error.code}: ${error.message}`, error.details ?? '')
    }
    sendError(res, error.status, error.code, error.message, error.details)
    return
  }

  console.error('[api] unhandled error:', error)
  sendError(res, 500, 'internal_error', 'Terjadi kesalahan pada server')
}

export function withApi(methods: string[], handler: ApiHandler): ApiHandler {
  return async (req, res) => {
    applyCors(req, res)

    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }

    if (!req.method || !methods.includes(req.method)) {
      res.setHeader('Allow', [...methods, 'OPTIONS'].join(', '))
      sendError(
        res,
        405,
        'method_not_allowed',
        `Method ${req.method ?? 'UNKNOWN'} tidak diizinkan`,
      )
      return
    }

    try {
      await handler(req, res)
    } catch (error) {
      handleError(res, error)
    }
  }
}

export function queryValue(req: VercelRequest, key: string): string | undefined {
  const value = req.query[key]
  return Array.isArray(value) ? value[0] : value
}

export function getBody(req: VercelRequest): unknown {
  const body: unknown = req.body

  if (body === undefined || body === null || body === '') {
    return {}
  }

  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8'))
    } catch {
      throw new ApiError(400, 'validation_error', 'Body harus berupa JSON yang valid')
    }
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      throw new ApiError(400, 'validation_error', 'Body harus berupa JSON yang valid')
    }
  }

  return body
}

export function requireAdmin(req: VercelRequest): void {
  const expected = process.env.ADMIN_API_TOKEN

  if (!expected) {
    throw new ApiError(
      500,
      'server_misconfigured',
      'ADMIN_API_TOKEN belum dikonfigurasi pada environment backend',
    )
  }

  const header = req.headers.authorization
  const provided =
    typeof header === 'string' && header.toLowerCase().startsWith('bearer ')
      ? header.slice(7).trim()
      : ''

  const providedBuffer = Buffer.from(provided)
  const expectedBuffer = Buffer.from(expected)
  const valid =
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)

  if (!valid) {
    throw new ApiError(401, 'unauthorized', 'Token admin tidak valid')
  }
}
