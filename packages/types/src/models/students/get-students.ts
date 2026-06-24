import { z } from 'zod'

import { paginationMetaSchema, paginationQuerySchema } from '../pagination'

export const getStudentsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetStudentsParams = z.infer<typeof getStudentsParamsSchema>

export const getStudentsRequestSchema = z.object({
  params: getStudentsParamsSchema,
  query: paginationQuerySchema.optional(),
})

export type GetStudentsRequest = z.infer<typeof getStudentsRequestSchema>

export const getStudentsResponseSchema = z.object({
  students: z.array(
    z.object({
      id: z.string(),
      code: z.number(),
      name: z.string(),
      cpf: z.string().nullable(),
      email: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
      class: z.object({
        id: z.string().uuid(),
        name: z.string(),
        year: z.string(),
      }),
      points: z.array(
        z.object({
          id: z.string(),
          amount: z.number(),
          createdAt: z.date(),
        }),
      ),
      totalPoints: z.number(),
    }),
  ),
  meta: paginationMetaSchema,
})

export type GetStudentsResponse = z.infer<typeof getStudentsResponseSchema>
