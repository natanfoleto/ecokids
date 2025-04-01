import { z } from 'zod'

export const requestUserPasswordRecoverBodySchema = z.object({
  email: z.string().email(),
})

export type RequestUserPasswordRecoverBody = z.infer<
  typeof requestUserPasswordRecoverBodySchema
>

export const requestUserPasswordRecoverRequestSchema = z.object({
  body: requestUserPasswordRecoverBodySchema,
})

export type RequestUserPasswordRecoverRequest = z.infer<
  typeof requestUserPasswordRecoverRequestSchema
>

export const requestUserPasswordRecoverResponseSchema = z.null()

export type RequestUserPasswordRecoverResponse = z.infer<
  typeof requestUserPasswordRecoverResponseSchema
>
