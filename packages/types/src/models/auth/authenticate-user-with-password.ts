import { z } from 'zod'

export const authenticateUserWithPasswordBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthenticateUserWithPasswordBody = z.infer<
  typeof authenticateUserWithPasswordBodySchema
>

export const authenticateUserWithPasswordRequest = z.object({
  body: authenticateUserWithPasswordBodySchema,
})

export type AuthenticateUserWithPasswordRequest = z.infer<
  typeof authenticateUserWithPasswordRequest
>

export const authenticateUserWithPasswordResponseSchema = z.object({
  token: z.string(),
})

export type AuthenticateUserWithPasswordResponse = z.infer<
  typeof authenticateUserWithPasswordResponseSchema
>
