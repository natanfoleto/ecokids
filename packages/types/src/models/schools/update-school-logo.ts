import { z } from 'zod'

export const updateSchoolLogoParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type UpdateSchoolLogoParams = z.infer<
  typeof updateSchoolLogoParamsSchema
>

export const updateSchoolLogoResponseSchema = z.null()

export type UpdateSchoolLogoResponse = z.infer<
  typeof updateSchoolLogoResponseSchema
>
