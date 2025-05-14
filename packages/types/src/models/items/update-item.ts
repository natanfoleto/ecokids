import { z } from 'zod'

export const updateItemParamsSchema = z.object({
  schoolSlug: z.string(),
  itemId: z.string().uuid(),
})

export type UpdateItemParams = z.infer<typeof updateItemParamsSchema>

export const updateItemBodySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'O nome precisa ter no mínimo um caracter.' }),
  description: z.string().nullable(),
  value: z.number().positive({ message: 'O valor precisa ser positivo.' }),
  photoUrl: z.string().nullable().optional(),
})

export type UpdateItemBody = z.infer<typeof updateItemBodySchema>

export const updateItemRequestSchema = z.object({
  body: updateItemBodySchema,
  params: updateItemParamsSchema,
})

export type UpdateItemRequest = z.infer<typeof updateItemRequestSchema>

export const updateItemResponseSchema = z.null()

export type UpdateItemResponse = z.infer<typeof updateItemResponseSchema>
