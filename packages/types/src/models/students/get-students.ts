import { z } from 'zod'

export const getStudentsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetStudentsParams = z.infer<typeof getStudentsParamsSchema>

export const getStudentsRequestSchema = z.object({
  params: getStudentsParamsSchema,
})

export type GetStudentsRequest = z.infer<typeof getStudentsRequestSchema>

export const getStudentsResponseSchema = z.object({
  students: z.array(
    z.object({
      id: z.string().uuid(),
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
    }),
  ),
})

export type GetStudentsResponse = z.infer<typeof getStudentsResponseSchema>
