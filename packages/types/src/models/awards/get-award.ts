import { z } from 'zod'

export const getAwardParamsSchema = z.object({
  schoolSlug: z.string(),
  awardId: z.string().uuid(),
})

export type GetAwardParams = z.infer<typeof getAwardParamsSchema>

export const getAwardRequestSchema = z.object({
  params: getAwardParamsSchema,
})

export type GetAwardRequest = z.infer<typeof getAwardRequestSchema>

export const getAwardResponseSchema = z.object({
  award: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    value: z.number(),
    photoUrl: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export type GetAwardResponse = z.infer<typeof getAwardResponseSchema>
