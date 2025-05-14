import { z } from 'zod'

export const updateItemPhotoParamsSchema = z.object({
  schoolSlug: z.string(),
  itemId: z.string().uuid(),
})

export type UpdateItemPhotoParams = z.infer<typeof updateItemPhotoParamsSchema>

export const updateItemPhotoResponseSchema = z.null()

export type UpdateItemPhotoResponse = z.infer<
  typeof updateItemPhotoResponseSchema
>
