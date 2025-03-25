import { z } from 'zod'

export const resetPasswordBodySchema = z.object({
  code: z.string(),
  password: z.string().min(6),
})

export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>

export const resetPasswordRequestSchema = z.object({
  body: resetPasswordBodySchema,
})

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>

export const resetPasswordResponseSchema = z.null()

export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>
