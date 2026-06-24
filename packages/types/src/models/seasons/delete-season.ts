import { z } from 'zod'

export const deleteSeasonParamsSchema = z.object({
  schoolSlug: z.string(),
  seasonId: z.string().uuid(),
})

export type DeleteSeasonParams = z.infer<typeof deleteSeasonParamsSchema>

export const deleteSeasonRequestSchema = z.object({
  params: deleteSeasonParamsSchema,
})

export type DeleteSeasonRequest = z.infer<typeof deleteSeasonRequestSchema>

export const deleteSeasonResponseSchema = z.null()

export type DeleteSeasonResponse = z.infer<typeof deleteSeasonResponseSchema>
