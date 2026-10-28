import { z } from 'zod'

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug wajib diisi')
  .max(120, 'Slug maksimal 120 karakter')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug hanya boleh huruf kecil, angka, dan tanda hubung',
  )

export const projectStatusSchema = z.enum(['live', 'in-progress', 'concept', 'archived'])
export const experienceTypeSchema = z.enum(['work', 'organization', 'education', 'volunteer'])
export const contactStatusSchema = z.enum(['new', 'read', 'archived'])

export const projectQuerySchema = paginationSchema.extend({
  category: z.string().trim().min(1).max(100).optional(),
  status: projectStatusSchema.optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  q: z.string().trim().min(1).max(100).optional(),
})

export const contactCreateSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().trim().max(200).email('Format email tidak valid'),
  subject: z.string().trim().min(3, 'Subjek minimal 3 karakter').max(150),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter').max(5000),
  website: z.string().max(200).optional(),
})

export const contactListQuerySchema = paginationSchema.extend({
  status: contactStatusSchema.optional(),
})

export const contactUpdateSchema = z.object({
  status: contactStatusSchema,
})

export const messageIdSchema = z.uuid()
export const idSchema = z.uuid()

const techSchema = z.array(z.string().trim().min(1).max(60)).max(30)
const sortOrderSchema = z.coerce.number().int().min(-100000).max(100000)
const nullableTextSchema = z
  .union([z.string().trim().max(300), z.null()])
  .transform((value) => (value === '' || value === null ? null : value))
const imageUrlSchema = z.union([
  z.string().trim().url('URL gambar tidak valid').max(2000),
  z.literal(''),
])
const nullableUrlSchema = z
  .union([z.string().trim().url('URL tidak valid').max(2000), z.literal(''), z.null()])
  .transform((value) => (value === '' || value === null ? null : value))
const yearNumberSchema = z.union([
  z.coerce.number().int().min(1900, 'Tahun minimal 1900').max(2200, 'Tahun maksimal 2200'),
  z.null(),
])

export const projectCreateSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, 'Judul wajib diisi').max(200),
  category: z.string().trim().min(1, 'Kategori wajib diisi').max(100),
  tech: techSchema.default([]),
  year: z.string().trim().min(1, 'Tahun wajib diisi').max(20),
  status: projectStatusSchema.default('in-progress'),
  description: z.string().trim().min(1, 'Deskripsi wajib diisi').max(2000),
  fullDescription: z.string().trim().max(20000).default(''),
  imageUrl: imageUrlSchema.default(''),
  repoUrl: nullableUrlSchema.optional(),
  liveUrl: nullableUrlSchema.optional(),
  featured: z.boolean().default(false),
  sortOrder: sortOrderSchema.default(0),
})

export const projectUpdateSchema = z
  .object({
    slug: slugSchema.optional(),
    title: z.string().trim().min(1, 'Judul wajib diisi').max(200).optional(),
    category: z.string().trim().min(1, 'Kategori wajib diisi').max(100).optional(),
    tech: techSchema.optional(),
    year: z.string().trim().min(1, 'Tahun wajib diisi').max(20).optional(),
    status: projectStatusSchema.optional(),
    description: z.string().trim().min(1, 'Deskripsi wajib diisi').max(2000).optional(),
    fullDescription: z.string().trim().max(20000).optional(),
    imageUrl: imageUrlSchema.optional(),
    repoUrl: nullableUrlSchema.optional(),
    liveUrl: nullableUrlSchema.optional(),
    featured: z.boolean().optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Minimal satu field harus diisi',
  })

export const buildingCreateSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1, 'Judul wajib diisi').max(200),
  tagline: z.string().trim().max(300).default(''),
  description: z.string().trim().max(5000).default(''),
  detail: z.string().trim().max(20000).default(''),
  linkUrl: nullableUrlSchema.optional(),
  sortOrder: sortOrderSchema.default(0),
})

export const buildingUpdateSchema = z
  .object({
    slug: slugSchema.optional(),
    title: z.string().trim().min(1, 'Judul wajib diisi').max(200).optional(),
    tagline: z.string().trim().max(300).optional(),
    description: z.string().trim().max(5000).optional(),
    detail: z.string().trim().max(20000).optional(),
    linkUrl: nullableUrlSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Minimal satu field harus diisi',
  })

export const experienceCreateSchema = z.object({
  organization: z.string().trim().min(1, 'Organisasi wajib diisi').max(200),
  title: z.string().trim().min(1, 'Posisi wajib diisi').max(200),
  description: z.string().trim().max(5000).default(''),
  startYear: yearNumberSchema.optional(),
  endYear: yearNumberSchema.optional(),
  type: experienceTypeSchema.default('organization'),
  sortOrder: sortOrderSchema.default(0),
})

export const experienceUpdateSchema = z
  .object({
    organization: z.string().trim().min(1, 'Organisasi wajib diisi').max(200).optional(),
    title: z.string().trim().min(1, 'Posisi wajib diisi').max(200).optional(),
    description: z.string().trim().max(5000).optional(),
    startYear: yearNumberSchema.optional(),
    endYear: yearNumberSchema.optional(),
    type: experienceTypeSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Minimal satu field harus diisi',
  })

export const awardCreateSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi').max(200),
  issuer: nullableTextSchema.optional(),
  year: nullableTextSchema.optional(),
  description: z.string().trim().max(5000).default(''),
  sortOrder: sortOrderSchema.default(0),
})

export const awardUpdateSchema = z
  .object({
    title: z.string().trim().min(1, 'Judul wajib diisi').max(200).optional(),
    issuer: nullableTextSchema.optional(),
    year: nullableTextSchema.optional(),
    description: z.string().trim().max(5000).optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Minimal satu field harus diisi',
  })

export const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(1, 'Nama wajib diisi').max(150).optional(),
    headline: z.string().trim().max(300).optional(),
    bio: z.array(z.string().trim().max(2000)).max(20).optional(),
    location: z.string().trim().max(200).optional(),
    email: z.string().trim().email('Format email tidak valid').max(200).optional(),
    avatarUrl: nullableUrlSchema.optional(),
    socials: z
      .array(
        z.object({
          name: z.string().trim().min(1, 'Nama social wajib diisi').max(60),
          url: z.string().trim().url('URL social tidak valid').max(2000),
        }),
      )
      .max(20)
      .optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Minimal satu field harus diisi',
  })

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
export type BuildingCreateInput = z.infer<typeof buildingCreateSchema>
export type BuildingUpdateInput = z.infer<typeof buildingUpdateSchema>
export type ExperienceCreateInput = z.infer<typeof experienceCreateSchema>
export type ExperienceUpdateInput = z.infer<typeof experienceUpdateSchema>
export type AwardCreateInput = z.infer<typeof awardCreateSchema>
export type AwardUpdateInput = z.infer<typeof awardUpdateSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>