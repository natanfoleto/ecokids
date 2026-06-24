import { z } from 'zod'

import { paginationMetaSchema, paginationQuerySchema } from '../pagination'

export const getAwardsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetAwardsParams = z.infer<typeof getAwardsParamsSchema>

export const getAwardsRequestSchema = z.object({
  params: getAwardsParamsSchema,
  query: paginationQuerySchema.optional(),
})

export type GetAwardsRequest = z.infer<typeof getAwardsRequestSchema>

export const getAwardsResponseSchema = z.object({
  awards: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string().nullable(),
      value: z.number(),
      photoUrl: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
  meta: paginationMetaSchema,
})

export type GetAwardsResponse = z.infer<typeof getAwardsResponseSchema>
