import { z } from 'zod'

export const createUserBodySchema = z.object({
  name: z.string().refine((value) => value.split(' ').length > 1, {
    message: 'Por favor, digite seu nome completo.',
  }),
  email: z.string().email({ message: 'Insira um e-mail válido.' }),
  cpf: z.string().min(14, { message: 'Insira um CPF válido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' }),
  confirm_password: z.string().optional(),
})

export type CreateUserBody = z.infer<typeof createUserBodySchema>

export const createUserRequestSchema = z.object({
  body: createUserBodySchema,
})

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>

export const createUserResponseSchema = z.object({
  userId: z.string().uuid(),
})

export type CreateUserResponse = z.infer<typeof createUserResponseSchema>
