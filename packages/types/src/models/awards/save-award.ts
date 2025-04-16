import { z } from 'zod'

import { createAwardBodySchema } from './create-award'
import { updateAwardBodySchema, updateAwardParamsSchema } from './update-award'

export const saveAwardParamsSchema = z.object({}).merge(updateAwardParamsSchema)

export type SaveAwardParams = z.infer<typeof saveAwardParamsSchema>

export const saveAwardBodySchema = z
  .object({})
  .merge(createAwardBodySchema)
  .merge(updateAwardBodySchema)

export type SaveAwardBody = z.infer<typeof saveAwardBodySchema>

export const saveAwardSchema = z.object({
  params: saveAwardParamsSchema,
  body: saveAwardBodySchema,
})

export type SaveAward = z.infer<typeof saveAwardSchema>
