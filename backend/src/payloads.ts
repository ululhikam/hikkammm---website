import type {
  AwardCreateInput,
  AwardUpdateInput,
  BuildingCreateInput,
  BuildingUpdateInput,
  ExperienceCreateInput,
  ExperienceUpdateInput,
  ProfileUpdateInput,
  ProjectCreateInput,
  ProjectUpdateInput,
} from './validation.js'

export function projectInsert(input: ProjectCreateInput) {
  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    tech: input.tech,
    year: input.year,
    status: input.status,
    description: input.description,
    full_description: input.fullDescription,
    image_url: input.imageUrl,
    repo_url: input.repoUrl ?? null,
    live_url: input.liveUrl ?? null,
    featured: input.featured,
    sort_order: input.sortOrder,
  }
}

export function projectPatch(input: ProjectUpdateInput) {
  const patch: Record<string, unknown> = {}

  if (input.slug !== undefined) patch.slug = input.slug
  if (input.title !== undefined) patch.title = input.title
  if (input.category !== undefined) patch.category = input.category
  if (input.tech !== undefined) patch.tech = input.tech
  if (input.year !== undefined) patch.year = input.year
  if (input.status !== undefined) patch.status = input.status
  if (input.description !== undefined) patch.description = input.description
  if (input.fullDescription !== undefined) patch.full_description = input.fullDescription
  if (input.imageUrl !== undefined) patch.image_url = input.imageUrl
  if (input.repoUrl !== undefined) patch.repo_url = input.repoUrl
  if (input.liveUrl !== undefined) patch.live_url = input.liveUrl
  if (input.featured !== undefined) patch.featured = input.featured
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder

  return patch
}

export function buildingInsert(input: BuildingCreateInput) {
  return {
    slug: input.slug,
    title: input.title,
    tagline: input.tagline,
    description: input.description,
    detail: input.detail,
    link_url: input.linkUrl ?? null,
    sort_order: input.sortOrder,
  }
}

export function buildingPatch(input: BuildingUpdateInput) {
  const patch: Record<string, unknown> = {}

  if (input.slug !== undefined) patch.slug = input.slug
  if (input.title !== undefined) patch.title = input.title
  if (input.tagline !== undefined) patch.tagline = input.tagline
  if (input.description !== undefined) patch.description = input.description
  if (input.detail !== undefined) patch.detail = input.detail
  if (input.linkUrl !== undefined) patch.link_url = input.linkUrl
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder

  return patch
}

export function experienceInsert(input: ExperienceCreateInput) {
  return {
    organization: input.organization,
    title: input.title,
    description: input.description,
    start_year: input.startYear ?? null,
    end_year: input.endYear ?? null,
    type: input.type,
    sort_order: input.sortOrder,
  }
}

export function experiencePatch(input: ExperienceUpdateInput) {
  const patch: Record<string, unknown> = {}

  if (input.organization !== undefined) patch.organization = input.organization
  if (input.title !== undefined) patch.title = input.title
  if (input.description !== undefined) patch.description = input.description
  if (input.startYear !== undefined) patch.start_year = input.startYear
  if (input.endYear !== undefined) patch.end_year = input.endYear
  if (input.type !== undefined) patch.type = input.type
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder

  return patch
}

export function awardInsert(input: AwardCreateInput) {
  return {
    title: input.title,
    issuer: input.issuer ?? null,
    year: input.year ?? null,
    description: input.description,
    sort_order: input.sortOrder,
  }
}

export function awardPatch(input: AwardUpdateInput) {
  const patch: Record<string, unknown> = {}

  if (input.title !== undefined) patch.title = input.title
  if (input.issuer !== undefined) patch.issuer = input.issuer
  if (input.year !== undefined) patch.year = input.year
  if (input.description !== undefined) patch.description = input.description
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder

  return patch
}

export function profilePatch(input: ProfileUpdateInput) {
  const patch: Record<string, unknown> = {}

  if (input.name !== undefined) patch.name = input.name
  if (input.headline !== undefined) patch.headline = input.headline
  if (input.bio !== undefined) patch.bio = input.bio
  if (input.location !== undefined) patch.location = input.location
  if (input.email !== undefined) patch.email = input.email
  if (input.avatarUrl !== undefined) patch.avatar_url = input.avatarUrl
  if (input.socials !== undefined) patch.socials = input.socials

  return patch
}