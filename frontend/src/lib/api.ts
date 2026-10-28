import type {
  Award,
  AwardInput,
  AwardUpdateInput,
  Building,
  BuildingInput,
  BuildingUpdateInput,
  ContactMessage,
  ContactMessageCreated,
  ContactMessagesQuery,
  ContactStatus,
  CreateContactMessage,
  Experience,
  ExperienceInput,
  ExperienceUpdateInput,
  Health,
  ItemResponse,
  ListResponse,
  PaginationQuery,
  Profile,
  ProfileInput,
  Project,
  ProjectInput,
  ProjectUpdateInput,
  ProjectsQuery,
} from './types'
import { clearAdminToken } from './auth'

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

    if (response.status === 401) {
      clearAdminToken()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('admin-unauthorized'))
      }
    }

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

  verifyAdmin(token: string): Promise<ListResponse<ContactMessage>> {
    return request<ListResponse<ContactMessage>>('/contact?limit=1', {
      headers: adminHeaders(token),
    })
  },

  createProject(token: string, input: ProjectInput): Promise<ItemResponse<Project>> {
    return request<ItemResponse<Project>>('/projects', {
      method: 'POST',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  updateProject(
    token: string,
    slug: string,
    input: ProjectUpdateInput,
  ): Promise<ItemResponse<Project>> {
    return request<ItemResponse<Project>>(`/projects/${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  deleteProject(token: string, slug: string): Promise<void> {
    return request<void>(`/projects/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: adminHeaders(token),
    })
  },

  createBuilding(token: string, input: BuildingInput): Promise<ItemResponse<Building>> {
    return request<ItemResponse<Building>>('/buildings', {
      method: 'POST',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  updateBuilding(
    token: string,
    slug: string,
    input: BuildingUpdateInput,
  ): Promise<ItemResponse<Building>> {
    return request<ItemResponse<Building>>(`/buildings/${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  deleteBuilding(token: string, slug: string): Promise<void> {
    return request<void>(`/buildings/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: adminHeaders(token),
    })
  },

  createExperience(
    token: string,
    input: ExperienceInput,
  ): Promise<ItemResponse<Experience>> {
    return request<ItemResponse<Experience>>('/experiences', {
      method: 'POST',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  updateExperience(
    token: string,
    id: string,
    input: ExperienceUpdateInput,
  ): Promise<ItemResponse<Experience>> {
    return request<ItemResponse<Experience>>(`/experiences/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  deleteExperience(token: string, id: string): Promise<void> {
    return request<void>(`/experiences/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminHeaders(token),
    })
  },

  createAward(token: string, input: AwardInput): Promise<ItemResponse<Award>> {
    return request<ItemResponse<Award>>('/awards', {
      method: 'POST',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  updateAward(
    token: string,
    id: string,
    input: AwardUpdateInput,
  ): Promise<ItemResponse<Award>> {
    return request<ItemResponse<Award>>(`/awards/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  deleteAward(token: string, id: string): Promise<void> {
    return request<void>(`/awards/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminHeaders(token),
    })
  },

  updateProfile(token: string, input: ProfileInput): Promise<ItemResponse<Profile>> {
    return request<ItemResponse<Profile>>('/profile', {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify(input),
    })
  },

  deleteContactMessage(token: string, id: string): Promise<void> {
    return request<void>(`/contact/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminHeaders(token),
    })
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
