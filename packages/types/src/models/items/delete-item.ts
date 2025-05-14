import { z } from 'zod'

export const deleteItemParamsSchema = z.object({
  schoolSlug: z.string(),
  itemId: z.string().uuid(),
})

export type DeleteItemParams = z.infer<typeof deleteItemParamsSchema>

export const deleteItemRequestSchema = z.object({
  params: deleteItemParamsSchema,
})

export type DeleteItemRequest = z.infer<typeof deleteItemRequestSchema>

export const deleteItemResponseSchema = z.null()

export type DeleteItemResponse = z.infer<typeof deleteItemResponseSchema>
