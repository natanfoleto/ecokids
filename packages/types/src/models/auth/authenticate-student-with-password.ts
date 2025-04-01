import { z } from 'zod'

export const authenticateStudentWithPasswordBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthenticateStudentWithPasswordBody = z.infer<
  typeof authenticateStudentWithPasswordBodySchema
>

export const authenticateStudentWithPasswordRequest = z.object({
  body: authenticateStudentWithPasswordBodySchema,
})

export type AuthenticateStudentWithPasswordRequest = z.infer<
  typeof authenticateStudentWithPasswordRequest
>

export const authenticateStudentWithPasswordResponseSchema = z.object({
  token: z.string(),
})

export type AuthenticateStudentWithPasswordResponse = z.infer<
  typeof authenticateStudentWithPasswordResponseSchema
>
