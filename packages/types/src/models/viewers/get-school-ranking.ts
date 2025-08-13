import { z } from 'zod'

export const getSchoolRankingParamsSchema = z.object({
  schoolId: z.string().uuid(),
})

export type GetSchoolRankingParams = z.infer<
  typeof getSchoolRankingParamsSchema
>

export const getSchoolRankingQuerySchema = z.object({
  classId: z.string().uuid().optional(),
})

export type GetSchoolRankingQuery = z.infer<typeof getSchoolRankingQuerySchema>

export const getSchoolRankingRequestSchema = z.object({
  params: getSchoolRankingParamsSchema,
  query: getSchoolRankingQuerySchema,
})

export type GetSchoolRankingRequest = z.infer<
  typeof getSchoolRankingRequestSchema
>

export const getSchoolRankingResponseSchema = z.object({
  ranking: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      totalPoints: z.number(),
    }),
  ),
})

export type GetSchoolRankingResponse = z.infer<
  typeof getSchoolRankingResponseSchema
>
