import { z } from 'zod'

export const createClassParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CreateClassParams = z.infer<typeof createClassParamsSchema>

export const createClassBodySchema = z.object({
  name: z.string().min(1, {
    message: 'Por favor, coloque pelo menos 1 caracteres.',
  }),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: 'O ano precisa ter exatamente 4 dígitos.' }),
})

export type CreateClassBody = z.infer<typeof createClassBodySchema>

export const createClassResponseSchema = z.object({
  classId: z.string().uuid(),
})

export type CreateClassResponse = z.infer<typeof createClassResponseSchema>

const createClassRequestSchema = z.object({
  body: createClassBodySchema,
})

export type CreateClassRequest = z.infer<typeof createClassRequestSchema>
