import { z } from 'zod'

import { createClassBodySchema } from './create-class'
import { updateClassBodySchema, updateClassParamsSchema } from './update-class'

export const saveClassParamsSchema = z.object({}).merge(updateClassParamsSchema)

export type SaveClassParams = z.infer<typeof saveClassParamsSchema>

export const saveClassBodySchema = z
  .object({})
  .merge(createClassBodySchema)
  .merge(updateClassBodySchema)

export type SaveClassBody = z.infer<typeof saveClassBodySchema>

export const saveClassSchema = z.object({
  params: saveClassParamsSchema,
  body: saveClassBodySchema,
})

export type SaveClass = z.infer<typeof saveClassSchema>
