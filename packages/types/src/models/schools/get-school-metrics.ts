import { z } from 'zod'

export const getSchoolMetricsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetSchoolMetricsParams = z.infer<
  typeof getSchoolMetricsParamsSchema
>

export const getSchoolMetricsQuerySchema = z.object({
  seasonId: z.string().uuid().optional(),
})

export type GetSchoolMetricsQuery = z.infer<typeof getSchoolMetricsQuerySchema>

export const getSchoolMetricsRequestSchema = z.object({
  params: getSchoolMetricsParamsSchema,
  query: getSchoolMetricsQuerySchema.optional(),
})

export type GetSchoolMetricsRequest = z.infer<
  typeof getSchoolMetricsRequestSchema
>

export const getSchoolMetricsResponseSchema = z.object({
  metrics: z.object({
    totalStudents: z.number(),
    totalPoints: z.number(),
    totalItemsRecycled: z.number(),
    participationPercentage: z.number(),
    inactiveStudentsCount: z.number(),
  }),
  classroomsLeaderboard: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      year: z.string(),
      totalPoints: z.number(),
      studentsCount: z.number(),
      participationRate: z.number(),
    }),
  ),
  mostRecycledItems: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      totalQuantity: z.number(),
      pointsValue: z.number(),
    }),
  ),
  recentActivity: z.array(
    z.object({
      id: z.string().uuid(),
      studentName: z.string(),
      className: z.string(),
      pointsAmount: z.number(),
      createdAt: z.date(),
      itemsCount: z.number(),
    }),
  ),
})

export type GetSchoolMetricsResponse = z.infer<
  typeof getSchoolMetricsResponseSchema
>
