import { z } from 'zod'

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export const projectStatusSchema = z.enum(['live', 'in-progress', 'concept', 'archived'])

export const projectQuerySchema = paginationSchema.extend({
  category: z.string().trim().min(1).max(100).optional(),
  status: projectStatusSchema.optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  q: z.string().trim().min(1).max(100).optional(),
})

export const contactStatusSchema = z.enum(['new', 'read', 'archived'])

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
