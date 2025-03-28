import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const getSchoolParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetSchoolParams = z.infer<typeof getSchoolParamsSchema>

export const getSchoolRequestSchema = z.object({
  params: getSchoolParamsSchema,
})

export type GetSchoolRequest = z.infer<typeof getSchoolRequestSchema>

export const getSchoolResponseSchema = z.object({
  school: z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    logoUrl: z.string().url().nullable(),
    role: roleSchema,
    shouldAttachUsersByDomain: z.boolean(),
    domain: z.string().nullable(),
    ownerId: z.string().uuid(),
  }),
})

export type GetSchoolResponse = z.infer<typeof getSchoolResponseSchema>
