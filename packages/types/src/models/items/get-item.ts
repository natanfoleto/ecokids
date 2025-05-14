import { z } from 'zod'

export const getItemParamsSchema = z.object({
  schoolSlug: z.string(),
  itemId: z.string().uuid(),
})

export type GetItemParams = z.infer<typeof getItemParamsSchema>

export const getItemRequestSchema = z.object({
  params: getItemParamsSchema,
})

export type GetItemRequest = z.infer<typeof getItemRequestSchema>

export const getItemResponseSchema = z.object({
  item: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    value: z.number(),
    photoUrl: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export type GetItemResponse = z.infer<typeof getItemResponseSchema>
