import { z } from 'zod'

export const createStudentParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CreateStudentParams = z.infer<typeof createStudentParamsSchema>

export const createStudentBodySchema = z.object({
  name: z.string().refine((value) => value.split(' ').length > 1, {
    message: 'Por favor, digite seu nome completo.',
  }),
  email: z.string().email({ message: 'Insira um e-mail válido.' }).nullable(),
  cpf: z.string({ message: 'Insira um CPF válido.' }).nullable(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  classId: z.string().uuid({ message: 'Selecione uma classe válida.' }),
})

export type CreateStudentBody = z.infer<typeof createStudentBodySchema>

export const createStudentRequestSchema = z.object({
  params: createStudentParamsSchema,
  body: createStudentBodySchema,
})

export type CreateStudentRequest = z.infer<typeof createStudentRequestSchema>

export const createStudentResponseSchema = z.object({
  studentId: z.string().uuid(),
})

export type CreateStudentResponse = z.infer<typeof createStudentResponseSchema>
