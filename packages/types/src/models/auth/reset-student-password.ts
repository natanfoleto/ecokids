import { z } from 'zod'

export const resetStudentPasswordBodySchema = z.object({
  code: z.string(),
  password: z.string().min(6),
})

export type ResetStudentPasswordBody = z.infer<
  typeof resetStudentPasswordBodySchema
>

export const resetStudentPasswordRequestSchema = z.object({
  body: resetStudentPasswordBodySchema,
})

export type ResetStudentPasswordRequest = z.infer<
  typeof resetStudentPasswordRequestSchema
>

export const resetStudentPasswordResponseSchema = z.null()

export type ResetStudentPasswordResponse = z.infer<
  typeof resetStudentPasswordResponseSchema
>
