import { z } from 'zod'

export const updateStudentPasswordBodySchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'A senha atual é obrigatória.' }),
    newPassword: z
      .string()
      .min(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'A confirmação deve ter no mínimo 6 caracteres.' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'A nova senha deve ser diferente da senha atual',
    path: ['newPassword'],
  })

export type UpdateStudentPasswordBody = z.infer<
  typeof updateStudentPasswordBodySchema
>

export const updateStudentPasswordRequestSchema = z.object({
  body: updateStudentPasswordBodySchema,
})

export type UpdateStudentPasswordRequest = z.infer<
  typeof updateStudentPasswordRequestSchema
>

export const updateStudentPasswordResponseSchema = z.null()

export type UpdateStudentPasswordResponse = z.infer<
  typeof updateStudentPasswordResponseSchema
>
