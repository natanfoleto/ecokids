import { z } from 'zod'

export const createItemParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CreateItemParams = z.infer<typeof createItemParamsSchema>

export const createItemBodySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'O nome precisa ter no mínimo um caracter.' }),
  description: z.string().nullable(),
  value: z.number().positive({ message: 'O valor precisa ser positivo.' }),
  photoUrl: z.string().nullable().optional(),
})

export type CreateItemBody = z.infer<typeof createItemBodySchema>

export const createItemRequestSchema = z.object({
  params: createItemParamsSchema,
  body: createItemBodySchema,
})

export type CreateItemRequest = z.infer<typeof createItemRequestSchema>

export const createItemResponseSchema = z.object({
  itemId: z.string().uuid(),
})

export type CreateItemResponse = z.infer<typeof createItemResponseSchema>
