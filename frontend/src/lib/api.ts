import type {
  Award,
  Building,
  ContactMessage,
  ContactMessageCreated,
  ContactMessagesQuery,
  ContactStatus,
  CreateContactMessage,
  Experience,
  Health,
  ItemResponse,
  ListResponse,
  PaginationQuery,
  Profile,
  Project,
  ProjectsQuery,
} from './types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '')

interface ApiErrorPayload {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

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

function toQueryString(params?: object): string {
  if (!params) return ''

  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  }

  const query = search.toString()
  return query ? `?${query}` : ''
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')

  if (init.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  const payload = (await response.json().catch(() => null)) as ApiErrorPayload | T | null

  if (!response.ok) {
    const error = (payload as ApiErrorPayload | null)?.error
    throw new ApiError(
      response.status,
      error?.code ?? 'unknown_error',
      error?.message ?? `Request gagal (${response.status})`,
      error?.details,
    )
  }

  return payload as T
}

function adminHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export const api = {
  health(): Promise<Health> {
    return request<Health>('/health')
  },

  getProfile(): Promise<ItemResponse<Profile>> {
    return request<ItemResponse<Profile>>('/profile')
  },

  listProjects(query?: ProjectsQuery): Promise<ListResponse<Project>> {
    return request<ListResponse<Project>>(`/projects${toQueryString(query)}`)
  },

  getProject(slug: string): Promise<ItemResponse<Project>> {
    return request<ItemResponse<Project>>(`/projects/${encodeURIComponent(slug)}`)
  },

  listBuildings(query?: PaginationQuery): Promise<ListResponse<Building>> {
    return request<ListResponse<Building>>(`/buildings${toQueryString(query)}`)
  },

  getBuilding(slug: string): Promise<ItemResponse<Building>> {
    return request<ItemResponse<Building>>(`/buildings/${encodeURIComponent(slug)}`)
  },

  listExperiences(query?: PaginationQuery): Promise<ListResponse<Experience>> {
    return request<ListResponse<Experience>>(`/experiences${toQueryString(query)}`)
  },

  listAwards(query?: PaginationQuery): Promise<ListResponse<Award>> {
    return request<ListResponse<Award>>(`/awards${toQueryString(query)}`)
  },

  createContactMessage(input: CreateContactMessage): Promise<ItemResponse<ContactMessageCreated>> {
    return request<ItemResponse<ContactMessageCreated>>('/contact', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  listContactMessages(
    token: string,
    query?: ContactMessagesQuery,
  ): Promise<ListResponse<ContactMessage>> {
    return request<ListResponse<ContactMessage>>(`/contact${toQueryString(query)}`, {
      headers: adminHeaders(token),
    })
  },

  updateContactMessageStatus(
    token: string,
    id: string,
    status: ContactStatus,
  ): Promise<ItemResponse<ContactMessage>> {
    return request<ItemResponse<ContactMessage>>(`/contact/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify({ status }),
    })
  },
}
