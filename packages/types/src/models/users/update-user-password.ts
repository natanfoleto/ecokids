import { z } from 'zod'

export const updateUserPasswordBodySchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Digite a senha atual.' }),
    newPassword: z
      .string()
      .min(4, { message: 'A senha precisa ter no mínimo 4 caracteres.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Confirmação senha não coincide com nova senha',
    path: ['confirmPassword'],
  })

export type UpdateUserPasswordBody = z.infer<
  typeof updateUserPasswordBodySchema
>

export const updateUserPasswordRequestSchema = z.object({
  body: updateUserPasswordBodySchema,
})

export type UpdateUserPasswordRequest = z.infer<
  typeof updateUserPasswordRequestSchema
>

export const updateUserPasswordResponseSchema = z.null()

export type UpdateUserPasswordResponse = z.infer<
  typeof updateUserPasswordResponseSchema
>
