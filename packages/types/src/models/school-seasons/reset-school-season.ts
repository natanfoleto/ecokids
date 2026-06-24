import { z } from 'zod'

export const resetSchoolSeasonParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type ResetSchoolSeasonParams = z.infer<
  typeof resetSchoolSeasonParamsSchema
>

export const resetSchoolSeasonRequestSchema = z.object({
  params: resetSchoolSeasonParamsSchema,
})

export type ResetSchoolSeasonRequest = z.infer<
  typeof resetSchoolSeasonRequestSchema
>

export const resetSchoolSeasonResponseSchema = z.object({
  success: z.boolean(),
})

export type ResetSchoolSeasonResponse = z.infer<
  typeof resetSchoolSeasonResponseSchema
>
