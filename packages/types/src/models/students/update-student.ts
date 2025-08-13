import { z } from 'zod'

export const updateStudentParamsSchema = z.object({
  schoolSlug: z.string(),
  studentId: z.string().uuid(),
})

export type UpdateStudentParams = z.infer<typeof updateStudentParamsSchema>

export const updateStudentBodySchema = z.object({
  name: z.string().refine((value) => value.split(' ').length > 1, {
    message: 'Por favor, digite seu nome completo.',
  }),
  email: z.string().email({ message: 'Insira um e-mail válido.' }).nullable(),
  cpf: z.string({ message: 'Insira um CPF válido.' }).nullable(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  classId: z.string().uuid({ message: 'Selecione uma classe válida.' }),
})

export type UpdateStudentBody = z.infer<typeof updateStudentBodySchema>

export const updateStudentRequestSchema = z.object({
  params: updateStudentParamsSchema,
  body: updateStudentBodySchema,
})

export type UpdateStudentRequest = z.infer<typeof updateStudentRequestSchema>

export const updateStudentResponseSchema = z.null()

export type UpdateStudentResponse = z.infer<typeof updateStudentResponseSchema>
