import { api } from './api'
import fallbackProjectImage from '@/assets/hikam_narative.webp'
import type {
  Award as ApiAward,
  Building as ApiBuilding,
  Experience as ApiExperience,
  ListResponse,
  PaginationQuery,
  Profile,
  Project as ApiProject,
  ProjectStatus,
} from './types'

export interface PublicProject {
  slug: string
  title: string
  category: string
  tech: string
  year: string
  status: 'Live' | 'In Progress' | 'Concept' | 'Archived'
  desc: string
  fullDesc: string
  img: string
  repo?: string
  live?: string
}

export interface PublicBuilding {
  slug: string
  title: string
  tagline: string
  desc: string
  link?: string
  detail: string
}

export interface PublicExperience {
  org: string
  title: string
  role: string
}

export interface PublicAward {
  title: string
  desc: string
  meta: string
}

const projectStatusLabels: Record<ProjectStatus, PublicProject['status']> = {
  live: 'Live',
  'in-progress': 'In Progress',
  concept: 'Concept',
  archived: 'Archived',
}

async function fetchAll<T>(
  loader: (query: PaginationQuery) => Promise<ListResponse<T>>,
): Promise<T[]> {
  const limit = 100
  let offset = 0
  const items: T[] = []

  for (;;) {
    const response = await loader({ limit, offset })
    items.push(...response.data)
    offset += response.data.length

    if (response.data.length === 0 || offset >= response.meta.total) {
      break
    }
  }

  return items
}

export function mapPublicProject(project: ApiProject): PublicProject {
  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    tech: project.tech.join(' / '),
    year: project.year,
    status: projectStatusLabels[project.status],
    desc: project.description,
    fullDesc: project.fullDescription || project.description,
    img: project.imageUrl || fallbackProjectImage,
    repo: project.repoUrl ?? undefined,
    live: project.liveUrl ?? undefined,
  }
}

export function mapPublicBuilding(building: ApiBuilding): PublicBuilding {
  return {
    slug: building.slug,
    title: building.title,
    tagline: building.tagline,
    desc: building.description || building.tagline,
    link: building.linkUrl ?? undefined,
    detail: building.detail || building.description,
  }
}

export function mapPublicExperience(experience: ApiExperience): PublicExperience {
  return {
    org: experience.organization,
    title: experience.title,
    role: experience.description,
  }
}

export function mapPublicAward(award: ApiAward): PublicAward {
  const meta = [award.issuer, award.year].filter(Boolean).join(' · ')
  return {
    title: award.title,
    desc: award.description || meta,
    meta: meta || 'Achievement',
  }
}

export async function loadProjects(): Promise<PublicProject[]> {
  const projects = await fetchAll(api.listProjects)
  return projects.map(mapPublicProject)
}

export async function loadBuildings(): Promise<PublicBuilding[]> {
  const buildings = await fetchAll(api.listBuildings)
  return buildings.map(mapPublicBuilding)
}

export async function loadExperiences(): Promise<PublicExperience[]> {
  const experiences = await fetchAll(api.listExperiences)
  return experiences.map(mapPublicExperience)
}

export async function loadAwards(): Promise<PublicAward[]> {
  const awards = await fetchAll(api.listAwards)
  return awards.map(mapPublicAward)
}

export async function loadProfile(): Promise<Profile> {
  const response = await api.getProfile()
  return response.data
}