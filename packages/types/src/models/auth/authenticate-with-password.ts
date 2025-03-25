import { z } from 'zod'

export const authenticateWithPasswordBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthenticateWithPasswordBody = z.infer<
  typeof authenticateWithPasswordBodySchema
>

export const authenticateWithPasswordRequest = z.object({
  body: authenticateWithPasswordBodySchema,
})

export type AuthenticateWithPasswordRequest = z.infer<
  typeof authenticateWithPasswordRequest
>

export const authenticateWithPasswordResponseSchema = z.object({
  token: z.string(),
})

export type AuthenticateWithPasswordResponse = z.infer<
  typeof authenticateWithPasswordResponseSchema
>
