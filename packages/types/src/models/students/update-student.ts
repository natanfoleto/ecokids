import { z } from 'zod'

export const updateStudentParamsSchema = z.object({
  schoolSlug: z.string(),
  studentId: z.string().uuid(),
})

export type UpdateStudentParams = z.infer<typeof updateStudentParamsSchema>

export const updateStudentBodySchema = z
  .object({
    code: z.number().optional(),
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Por favor, digite seu nome completo.',
    }),
    email: z.string().email({ message: 'Insira um e-mail válido.' }).optional(),
    cpf: z.string({ message: 'Insira um CPF válido.' }).optional(),
    classId: z.string().uuid().optional(),
  })
  .refine((data) => data.cpf || data.email, {
    message: 'É obrigatório passar e-mail ou CPF.',
    path: ['cpf', 'email'],
  })

export type UpdateStudentBody = z.infer<typeof updateStudentBodySchema>

export const updateStudentRequestSchema = z.object({
  body: updateStudentBodySchema,
})

export type UpdateStudentRequest = z.infer<typeof updateStudentRequestSchema>
