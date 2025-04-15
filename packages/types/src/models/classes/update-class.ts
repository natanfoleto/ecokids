import { z } from 'zod'

export const updateClassParamsSchema = z.object({
  schoolSlug: z.string(),
  classId: z.string().uuid(),
})

export type UpdateClassParams = z.infer<typeof updateClassParamsSchema>

export const updateClassBodySchema = z.object({
  name: z.string().min(1, {
    message: 'Por favor, coloque pelo menos 1 caracteres.',
  }),
  year: z
    .string()
    .regex(/^\d{4}$/, { message: 'O ano precisa ter exatamente 4 dígitos.' }),
})

export type UpdateClassBody = z.infer<typeof updateClassBodySchema>

const updateClassRequestSchema = z.object({
  params: updateClassParamsSchema,
  body: updateClassBodySchema,
})

export type UpdateClassRequest = z.infer<typeof updateClassRequestSchema>

export const updateClassResponseSchema = z.null()

export type UpdateClassResponse = z.infer<typeof updateClassResponseSchema>
