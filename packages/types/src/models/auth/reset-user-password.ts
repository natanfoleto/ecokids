import { z } from 'zod'

export const resetUserPasswordBodySchema = z.object({
  code: z.string(),
  password: z.string().min(6),
})

export type ResetUserPasswordBody = z.infer<typeof resetUserPasswordBodySchema>

export const resetUserPasswordRequestSchema = z.object({
  body: resetUserPasswordBodySchema,
})

export type ResetUserPasswordRequest = z.infer<
  typeof resetUserPasswordRequestSchema
>

export const resetUserPasswordResponseSchema = z.null()

export type ResetUserPasswordResponse = z.infer<
  typeof resetUserPasswordResponseSchema
>
