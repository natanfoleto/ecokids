import { z } from 'zod'

export const getItemsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetItemsParams = z.infer<typeof getItemsParamsSchema>

export const getItemsRequestSchema = z.object({
  params: getItemsParamsSchema,
})

export type GetItemsRequest = z.infer<typeof getItemsRequestSchema>

export const getItemsResponseSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string().nullable(),
      value: z.number(),
      photoUrl: z.string().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  ),
})

export type GetItemsResponse = z.infer<typeof getItemsResponseSchema>
