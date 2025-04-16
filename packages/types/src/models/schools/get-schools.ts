import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const getSchoolsResponseSchema = z.object({
  schools: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
      city: z.string().nullable(),
      state: z.string().nullable(),
      logoUrl: z.string().url().nullable(),
      role: roleSchema,
      createdAt: z.date(),
    }),
  ),
})

export type GetSchoolsResponse = z.infer<typeof getSchoolsResponseSchema>
