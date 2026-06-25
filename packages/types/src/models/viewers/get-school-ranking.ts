import { z } from 'zod'

export const getSchoolRankingParamsSchema = z.object({
  schoolId: z.string().uuid(),
})

export type GetSchoolRankingParams = z.infer<
  typeof getSchoolRankingParamsSchema
>

export const getSchoolRankingQuerySchema = z.object({
  classId: z.string().uuid().optional(),
  limit: z.coerce.number().min(1).optional(),
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
      id: z.string(),
      name: z.string(),
      totalPoints: z.number(),
    }),
  ),
  studentStats: z
    .object({
      position: z.number(),
      totalPoints: z.number(),
      pointsToFirst: z.number(),
      pointsToNext: z.number().nullable(),
    })
    .nullable()
    .optional(),
})

export type GetSchoolRankingResponse = z.infer<
  typeof getSchoolRankingResponseSchema
>
