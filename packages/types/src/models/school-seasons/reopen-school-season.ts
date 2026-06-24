import { z } from 'zod'

export const reopenSchoolSeasonParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type ReopenSchoolSeasonParams = z.infer<
  typeof reopenSchoolSeasonParamsSchema
>

export const reopenSchoolSeasonRequestSchema = z.object({
  params: reopenSchoolSeasonParamsSchema,
})

export type ReopenSchoolSeasonRequest = z.infer<
  typeof reopenSchoolSeasonRequestSchema
>

export const reopenSchoolSeasonResponseSchema = z.object({
  success: z.boolean(),
})

export type ReopenSchoolSeasonResponse = z.infer<
  typeof reopenSchoolSeasonResponseSchema
>
