import { z } from 'zod'

export const reopenSeasonParamsSchema = z.object({
  schoolSlug: z.string(),
  seasonId: z.string().uuid(),
})

export type ReopenSeasonParams = z.infer<typeof reopenSeasonParamsSchema>

export const reopenSeasonRequestSchema = z.object({
  params: reopenSeasonParamsSchema,
})

export type ReopenSeasonRequest = z.infer<typeof reopenSeasonRequestSchema>

export const reopenSeasonResponseSchema = z.object({
  success: z.boolean(),
})

export type ReopenSeasonResponse = z.infer<typeof reopenSeasonResponseSchema>
