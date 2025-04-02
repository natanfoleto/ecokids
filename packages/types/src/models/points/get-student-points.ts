import { z } from 'zod'

export const getStudentPointsParamsSchema = z.object({
  schoolSlug: z.string(),
  studentId: z.string().uuid(),
})

export type GetStudentPointsParams = z.infer<
  typeof getStudentPointsParamsSchema
>

export const getStudentPointsRequestSchema = z.object({
  params: getStudentPointsParamsSchema,
})

export type GetStudentPointsRequest = z.infer<
  typeof getStudentPointsRequestSchema
>

export const getStudentPointsResponseSchema = z.object({
  points: z.array(
    z.object({
      id: z.string().uuid(),
      amount: z.number(),
      createdAt: z.date(),
    }),
  ),
})

export type GetStudentPointsResponse = z.infer<
  typeof getStudentPointsResponseSchema
>
