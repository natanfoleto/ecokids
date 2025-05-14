import { z } from 'zod'

import { createItemBodySchema } from './create-item'
import { updateItemBodySchema, updateItemParamsSchema } from './update-item'

export const saveItemParamsSchema = z.object({}).merge(updateItemParamsSchema)

export type SaveItemParams = z.infer<typeof saveItemParamsSchema>

export const saveItemBodySchema = z
  .object({})
  .merge(createItemBodySchema)
  .merge(updateItemBodySchema)

export type SaveItemBody = z.infer<typeof saveItemBodySchema>

export const saveItemSchema = z.object({
  params: saveItemParamsSchema,
  body: saveItemBodySchema,
})

export type SaveItem = z.infer<typeof saveItemSchema>
