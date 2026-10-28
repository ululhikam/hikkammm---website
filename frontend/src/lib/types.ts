export type ProjectStatus = 'live' | 'in-progress' | 'concept' | 'archived'
export type ContactStatus = 'new' | 'read' | 'archived'
export type ExperienceType = 'work' | 'organization' | 'education' | 'volunteer'

export interface PaginationMeta {
  total: number
  limit: number
  offset: number
}

export interface ListResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ItemResponse<T> {
  data: T
}

export interface Health {
  status: 'ok' | 'degraded'
  service: string
  version: string
  database: 'ok' | 'unavailable'
  timestamp: string
}

export interface SocialLink {
  name: string
  url: string
}

export interface Profile {
  name: string
  headline: string
  bio: string[]
  location: string
  email: string
  avatarUrl: string | null
  socials: SocialLink[]
  updatedAt: string
}

export interface Project {
  id: string
  slug: string
  title: string
  category: string
  tech: string[]
  year: string
  status: ProjectStatus
  description: string
  fullDescription: string
  imageUrl: string
  repoUrl: string | null
  liveUrl: string | null
  featured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Building {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  detail: string
  linkUrl: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  organization: string
  title: string
  description: string
  startYear: number | null
  endYear: number | null
  type: ExperienceType
  sortOrder: number
}

export interface Award {
  id: string
  title: string
  issuer: string | null
  year: string | null
  description: string
  sortOrder: number
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactStatus
  createdAt: string
}

export interface ContactMessageCreated {
  id: string
  createdAt: string
}

export interface CreateContactMessage {
  name: string
  email: string
  subject: string
  message: string
  website?: string
}

export interface ProjectsQuery {
  category?: string
  status?: ProjectStatus
  featured?: boolean
  q?: string
  limit?: number
  offset?: number
}

export interface PaginationQuery {
  limit?: number
  offset?: number
}

export interface ContactMessagesQuery extends PaginationQuery {
  status?: ContactStatus
}

export interface ProjectInput {
  slug: string
  title: string
  category: string
  tech: string[]
  year: string
  status: ProjectStatus
  description: string
  fullDescription: string
  imageUrl: string
  repoUrl: string | null
  liveUrl: string | null
  featured: boolean
  sortOrder: number
}

export type ProjectUpdateInput = Partial<ProjectInput>

export interface BuildingInput {
  slug: string
  title: string
  tagline: string
  description: string
  detail: string
  linkUrl: string | null
  sortOrder: number
}

export type BuildingUpdateInput = Partial<BuildingInput>

export interface ExperienceInput {
  organization: string
  title: string
  description: string
  startYear: number | null
  endYear: number | null
  type: ExperienceType
  sortOrder: number
}

export type ExperienceUpdateInput = Partial<ExperienceInput>

export interface AwardInput {
  title: string
  issuer: string | null
  year: string | null
  description: string
  sortOrder: number
}

export type AwardUpdateInput = Partial<AwardInput>

export interface ProfileInput {
  name: string
  headline: string
  bio: string[]
  location: string
  email: string
  avatarUrl: string | null
  socials: SocialLink[]
}
