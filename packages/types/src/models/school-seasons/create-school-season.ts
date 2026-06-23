import { z } from 'zod'

export const createSchoolSeasonParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CreateSchoolSeasonParams = z.infer<
  typeof createSchoolSeasonParamsSchema
>

export const createSchoolSeasonBodySchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
})

export type CreateSchoolSeasonBody = z.infer<
  typeof createSchoolSeasonBodySchema
>

export const createSchoolSeasonRequestSchema = z.object({
  params: createSchoolSeasonParamsSchema,
  body: createSchoolSeasonBodySchema,
})

export type CreateSchoolSeasonRequest = z.infer<
  typeof createSchoolSeasonRequestSchema
>

export const createSchoolSeasonResponseSchema = z.object({
  seasonId: z.string().uuid(),
})

export type CreateSchoolSeasonResponse = z.infer<
  typeof createSchoolSeasonResponseSchema
>
