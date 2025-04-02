import { z } from 'zod'

export const createStudentParamsSchema = z.object({
  schoolSlug: z.string(),
  classId: z.string().uuid(),
})

export type CreateStudentParams = z.infer<typeof createStudentParamsSchema>

export const createStudentBodySchema = z
  .object({
    code: z.number().optional(),
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Por favor, digite seu nome completo.',
    }),
    email: z.string().email({ message: 'Insira um e-mail válido.' }).optional(),
    cpf: z.string({ message: 'Insira um CPF válido.' }).optional(),
    password: z
      .string()
      .min(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' }),
    confirm_password: z.string().optional(),
  })
  .refine(
    (data) => !data.confirm_password || data.password === data.confirm_password,
    {
      message: 'Confirmação de senha não coincide com a senha.',
      path: ['confirmar_senha'],
    },
  )
  .refine((data) => data.cpf || data.email, {
    message: 'É obrigatório passar e-mail ou CPF.',
    path: ['cpf', 'email'],
  })

export type CreateStudentBody = z.infer<typeof createStudentBodySchema>

export const createStudentRequestSchema = z.object({
  body: createStudentBodySchema,
})

export type CreateStudentRequest = z.infer<typeof createStudentRequestSchema>

export const createStudentResponseSchema = z.object({
  studentId: z.string().uuid(),
})

export type CreateStudentResponse = z.infer<typeof createStudentResponseSchema>
