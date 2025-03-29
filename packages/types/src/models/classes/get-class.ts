import { z } from 'zod'

export const getClassParamsSchema = z.object({
  schoolSlug: z.string(),
  classId: z.string().uuid(),
})

export type GetClassParams = z.infer<typeof getClassParamsSchema>

export const getClassRequestSchema = z.object({
  params: getClassParamsSchema,
})

export type GetClassRequest = z.infer<typeof getClassRequestSchema>

export const getClassResponseSchema = z.object({
  class: z.object({
    id: z.string().uuid(),
    name: z.string(),
    year: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export type GetClassResponse = z.infer<typeof getClassResponseSchema>
