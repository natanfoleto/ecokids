import { z } from 'zod'

export const getSchoolClassesParamsSchema = z.object({
  schoolId: z.string(),
})

export type GetSchoolClassesParams = z.infer<
  typeof getSchoolClassesParamsSchema
>

const getSchoolClassesRequestSchema = z.object({
  params: getSchoolClassesParamsSchema,
})

export type GetSchoolClassesRequest = z.infer<
  typeof getSchoolClassesRequestSchema
>

export const getSchoolClassesResponseSchema = z.object({
  classes: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      year: z.string(),
    }),
  ),
})

export type GetSchoolClassesResponse = z.infer<
  typeof getSchoolClassesResponseSchema
>
