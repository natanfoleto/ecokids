import { z } from 'zod'

export const requestPasswordRecoverBodySchema = z.object({
  email: z.string().email(),
})

export type RequestPasswordRecoverBody = z.infer<
  typeof requestPasswordRecoverBodySchema
>

export const requestPasswordRecoverRequestSchema = z.object({
  body: requestPasswordRecoverBodySchema,
})

export type RequestPasswordRecoverRequest = z.infer<
  typeof requestPasswordRecoverRequestSchema
>

export const requestPasswordRecoverResponseSchema = z.null()

export type RequestPasswordRecoverResponse = z.infer<
  typeof requestPasswordRecoverResponseSchema
>
