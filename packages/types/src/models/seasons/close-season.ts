import { z } from 'zod'

export const closeSeasonParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CloseSeasonParams = z.infer<typeof closeSeasonParamsSchema>

export const closeSeasonRequestSchema = z.object({
  params: closeSeasonParamsSchema,
})

export type CloseSeasonRequest = z.infer<typeof closeSeasonRequestSchema>

export const closeSeasonResponseSchema = z.null()

export type CloseSeasonResponse = z.infer<typeof closeSeasonResponseSchema>
