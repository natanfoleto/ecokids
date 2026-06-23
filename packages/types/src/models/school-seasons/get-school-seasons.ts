import { z } from 'zod'

export const getSchoolSeasonsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetSchoolSeasonsParams = z.infer<
  typeof getSchoolSeasonsParamsSchema
>

export const getSchoolSeasonsRequestSchema = z.object({
  params: getSchoolSeasonsParamsSchema,
})

export type GetSchoolSeasonsRequest = z.infer<
  typeof getSchoolSeasonsRequestSchema
>

export const getSchoolSeasonsResponseSchema = z.object({
  seasons: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      status: z.enum(['ACTIVE', 'FINISHED']),
      startedAt: z.date(),
      endedAt: z.date().nullable(),
      createdAt: z.date(),
      totalPoints: z.number(),
      uniqueStudentsCount: z.number(),
      totalRedemptions: z.number(),
    }),
  ),
})

export type GetSchoolSeasonsResponse = z.infer<
  typeof getSchoolSeasonsResponseSchema
>
