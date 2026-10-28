import type {
  AwardRow,
  BuildingRow,
  ContactMessageRow,
  ExperienceRow,
  ProfileRow,
  ProjectRow,
  SocialLink,
} from './types.js'

export function mapProject(row: ProjectRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    tech: row.tech ?? [],
    year: row.year,
    status: row.status,
    description: row.description,
    fullDescription: row.full_description,
    imageUrl: row.image_url,
    repoUrl: row.repo_url,
    liveUrl: row.live_url,
    featured: row.featured,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapBuilding(row: BuildingRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    description: row.description,
    detail: row.detail,
    linkUrl: row.link_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapExperience(row: ExperienceRow) {
  return {
    id: row.id,
    organization: row.organization,
    title: row.title,
    description: row.description,
    startYear: row.start_year,
    endYear: row.end_year,
    type: row.type,
    sortOrder: row.sort_order,
  }
}

export function mapAward(row: AwardRow) {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    year: row.year,
    description: row.description,
    sortOrder: row.sort_order,
  }
}

export function mapProfile(row: ProfileRow) {
  return {
    name: row.name,
    headline: row.headline,
    bio: Array.isArray(row.bio) ? (row.bio as string[]) : [],
    location: row.location,
    email: row.email,
    avatarUrl: row.avatar_url,
    socials: Array.isArray(row.socials) ? (row.socials as SocialLink[]) : [],
    updatedAt: row.updated_at,
  }
}

export function mapContactMessage(row: ContactMessageRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  }
}
