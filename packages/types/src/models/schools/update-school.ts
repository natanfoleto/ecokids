import { z } from 'zod'

export const updateSchoolParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type UpdateSchoolParams = z.infer<typeof updateSchoolParamsSchema>

export const updateSchoolBodySchema = z.object({
  name: z.string().min(4, {
    message: 'Por favor, coloque pelo menos 4 caracteres.',
  }),
  domain: z
    .string()
    .nullable()
    .refine(
      (value) => {
        if (value) {
          const dominioRegex =
            /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,}$/

          return dominioRegex.test(value)
        }

        return true
      },
      { message: 'Por favor, coloque um domínio válido.' },
    ),
  shouldAttachUsersByDomain: z
    .union([z.literal('on'), z.literal('off'), z.boolean()])
    .transform((value) => value === true || value === 'on')
    .default(false),
})

export type UpdateSchoolBody = z.infer<typeof updateSchoolBodySchema>

export const updateSchoolRequestSchema = z.object({
  params: updateSchoolParamsSchema,
  body: updateSchoolBodySchema,
})

export type UpdateSchoolRequest = z.infer<typeof updateSchoolRequestSchema>

export const updateSchoolResponseSchema = z.null()

export type UpdateSchoolResponse = z.infer<typeof updateSchoolResponseSchema>
