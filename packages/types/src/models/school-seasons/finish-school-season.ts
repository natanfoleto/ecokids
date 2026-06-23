import { z } from 'zod'

export const finishSchoolSeasonParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type FinishSchoolSeasonParams = z.infer<
  typeof finishSchoolSeasonParamsSchema
>

export const finishSchoolSeasonBodySchema = z.object({
  newSeasonName: z
    .string()
    .min(1, { message: 'O nome do novo ciclo é obrigatório.' }),
})

export type FinishSchoolSeasonBody = z.infer<
  typeof finishSchoolSeasonBodySchema
>

export const finishSchoolSeasonRequestSchema = z.object({
  params: finishSchoolSeasonParamsSchema,
  body: finishSchoolSeasonBodySchema,
})

export type FinishSchoolSeasonRequest = z.infer<
  typeof finishSchoolSeasonRequestSchema
>

export const finishSchoolSeasonResponseSchema = z.object({
  success: z.boolean(),
})

export type FinishSchoolSeasonResponse = z.infer<
  typeof finishSchoolSeasonResponseSchema
>
