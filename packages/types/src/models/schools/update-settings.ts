import { z } from 'zod'

export const updateSchoolSettingsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type UpdateSchoolSettingsParams = z.infer<
  typeof updateSchoolSettingsParamsSchema
>

export const updateSchoolSettingsBodySchema = z.object({
  nextSeasonMessage: z.string().nullable().optional(),
})

export type UpdateSchoolSettingsBody = z.infer<
  typeof updateSchoolSettingsBodySchema
>

export const updateSchoolSettingsRequestSchema = z.object({
  params: updateSchoolSettingsParamsSchema,
  body: updateSchoolSettingsBodySchema,
})

export type UpdateSchoolSettingsRequest = z.infer<
  typeof updateSchoolSettingsRequestSchema
>

export const updateSchoolSettingsResponseSchema = z.null()

export type UpdateSchoolSettingsResponse = z.infer<
  typeof updateSchoolSettingsResponseSchema
>
