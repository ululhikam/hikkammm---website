export type ProjectStatus = 'live' | 'in-progress' | 'concept' | 'archived'
export type ContactStatus = 'new' | 'read' | 'archived'
export type ExperienceType = 'work' | 'organization' | 'education' | 'volunteer'

export interface ProjectRow {
  id: string
  slug: string
  title: string
  category: string
  tech: string[] | null
  year: string
  status: ProjectStatus
  description: string
  full_description: string
  image_url: string
  repo_url: string | null
  live_url: string | null
  featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface BuildingRow {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  detail: string
  link_url: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ExperienceRow {
  id: string
  organization: string
  title: string
  description: string
  start_year: number | null
  end_year: number | null
  type: ExperienceType
  sort_order: number
}

export interface AwardRow {
  id: string
  title: string
  issuer: string | null
  year: string | null
  description: string
  sort_order: number
}

export interface ProfileRow {
  id: number
  name: string
  headline: string
  bio: unknown
  location: string
  email: string
  avatar_url: string | null
  socials: unknown
  updated_at: string
}

export interface ContactMessageRow {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: ContactStatus
  created_at: string
}

export interface SocialLink {
  name: string
  url: string
}
