import { z } from 'zod'

export const deleteAwardParamsSchema = z.object({
  schoolSlug: z.string(),
  awardId: z.string().uuid(),
})

export type DeleteAwardParams = z.infer<typeof deleteAwardParamsSchema>

export const deleteAwardRequestSchema = z.object({
  params: deleteAwardParamsSchema,
})

export type DeleteAwardRequest = z.infer<typeof deleteAwardRequestSchema>

export const deleteAwardResponseSchema = z.null()

export type DeleteAwardResponse = z.infer<typeof deleteAwardResponseSchema>
