import { z } from 'zod'

export const updateUserBodySchema = z.object({
  name: z.string().refine((value) => value.split(' ').length > 1, {
    message: 'Por favor, digite seu nome completo.',
  }),
  cpf: z.string().min(14, { message: 'Insira um CPF válido.' }),
  password: z.string().optional(),
  oldPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
})

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>

export const updateUserRequestSchema = z.object({
  body: updateUserBodySchema,
})

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>

export const updateUserResponseSchema = z.null()

export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema>
