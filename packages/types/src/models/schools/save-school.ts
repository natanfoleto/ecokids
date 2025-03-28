import { z } from 'zod'

import { createSchoolBodySchema } from './create-school'
import {
  updateSchoolBodySchema,
  updateSchoolParamsSchema,
} from './update-school'

export const saveSchoolParamsSchema = z
  .object({})
  .merge(updateSchoolParamsSchema)

export type SalvaImobiliariaParams = z.infer<typeof saveSchoolParamsSchema>

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
      path: ['dominio'],
    },
  )

export type saveSchoolBody = z.infer<typeof saveSchoolBodySchema>

export const saveSchoolSchema = z.object({
  body: saveSchoolBodySchema,
  params: saveSchoolParamsSchema,
})

export type saveSchool = z.infer<typeof saveSchoolSchema>
