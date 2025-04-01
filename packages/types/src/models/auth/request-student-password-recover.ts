import { z } from 'zod'

export const requestStudentPasswordRecoverBodySchema = z.object({
  email: z.string().email(),
})

export type RequestStudentPasswordRecoverBody = z.infer<
  typeof requestStudentPasswordRecoverBodySchema
>

export const requestStudentPasswordRecoverRequestSchema = z.object({
  body: requestStudentPasswordRecoverBodySchema,
})

export type RequestStudentPasswordRecoverRequest = z.infer<
  typeof requestStudentPasswordRecoverRequestSchema
>

export const requestStudentPasswordRecoverResponseSchema = z.null()

export type RequestStudentPasswordRecoverResponse = z.infer<
  typeof requestStudentPasswordRecoverResponseSchema
>
