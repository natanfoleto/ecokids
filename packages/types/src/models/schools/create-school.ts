import { z } from 'zod'

export const createSchoolBodySchema = z.object({
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

export type CreateSchoolBody = z.infer<typeof createSchoolBodySchema>

export const createSchoolResponseSchema = z.object({
  schoolId: z.string().uuid(),
})

export type CreateSchoolResponse = z.infer<typeof createSchoolResponseSchema>

const createSchoolRequestSchema = z.object({
  body: createSchoolBodySchema,
})

export type CreateSchoolRequest = z.infer<typeof createSchoolRequestSchema>
