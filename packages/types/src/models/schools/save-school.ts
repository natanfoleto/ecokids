import { z } from 'zod'

import { createSchoolBodySchema } from './create-school'
import {
  updateSchoolBodySchema,
  updateSchoolParamsSchema,
} from './update-school'

export const saveSchoolParamsSchema = z
  .object({})
  .merge(updateSchoolParamsSchema)

export type SaveSchoolParams = z.infer<typeof saveSchoolParamsSchema>

export const saveSchoolBodySchema = z
  .object({})
  .merge(createSchoolBodySchema)
  .merge(updateSchoolBodySchema)
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }

      return true
    },
    {
      message:
        'O domínio é obrigatório quando o ingresso automático está ativado.',
      path: ['domain'],
    },
  )

export type SaveSchoolBody = z.infer<typeof saveSchoolBodySchema>

export const saveSchoolSchema = z.object({
  params: saveSchoolParamsSchema,
  body: saveSchoolBodySchema,
})

export type SaveSchool = z.infer<typeof saveSchoolSchema>
