import { z } from 'zod'

export const updateAwardPhotoParamsSchema = z.object({
  schoolSlug: z.string(),
  awardId: z.string().uuid(),
})

export type UpdateAwardPhotoParams = z.infer<
  typeof updateAwardPhotoParamsSchema
>

export const updateAwardPhotoResponseSchema = z.null()

export type UpdateAwardPhotoResponse = z.infer<
  typeof updateAwardPhotoResponseSchema
>
