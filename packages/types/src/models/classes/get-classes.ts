import { z } from 'zod'

export const getClassesParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetClassesParams = z.infer<typeof getClassesParamsSchema>

const getClassesRequestSchema = z.object({
  params: getClassesParamsSchema,
})

export type GetClassesRequest = z.infer<typeof getClassesRequestSchema>

export const getClassesResponseSchema = z.object({
  classes: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      year: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
})

export type GetClassesResponse = z.infer<typeof getClassesResponseSchema>
