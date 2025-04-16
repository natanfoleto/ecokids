import { z } from 'zod'

import { createStudentBodySchema } from './create-student'
import {
  updateStudentBodySchema,
  updateStudentParamsSchema,
} from './update-student'

export const saveStudentParamsSchema = z
  .object({})
  .merge(updateStudentParamsSchema)

export type SaveStudentParams = z.infer<typeof saveStudentParamsSchema>

export const saveStudentBodySchema = z
  .object({})
  .merge(createStudentBodySchema)
  .merge(updateStudentBodySchema)

export type SaveStudentBody = z.infer<typeof saveStudentBodySchema>

export const saveStudentSchema = z.object({
  params: saveStudentParamsSchema,
  body: saveStudentBodySchema,
})

export type SaveStudent = z.infer<typeof saveStudentSchema>
