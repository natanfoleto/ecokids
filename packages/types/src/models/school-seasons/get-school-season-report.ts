import { z } from 'zod'

export const getSchoolSeasonReportParamsSchema = z.object({
  schoolSlug: z.string(),
  seasonId: z.string().uuid(),
})

export type GetSchoolSeasonReportParams = z.infer<
  typeof getSchoolSeasonReportParamsSchema
>

export const getSchoolSeasonReportQuerySchema = z.object({
  type: z.enum(['complete', 'simple']).optional(),
})

export type GetSchoolSeasonReportQuery = z.infer<
  typeof getSchoolSeasonReportQuerySchema
>

export const getSchoolSeasonReportRequestSchema = z.object({
  params: getSchoolSeasonReportParamsSchema,
  query: getSchoolSeasonReportQuerySchema.optional(),
})

export type GetSchoolSeasonReportRequest = z.infer<
  typeof getSchoolSeasonReportRequestSchema
>
