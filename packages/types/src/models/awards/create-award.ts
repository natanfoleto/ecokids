import { z } from 'zod'

export const createAwardParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CreateAwardParams = z.infer<typeof createAwardParamsSchema>

export const createAwardBodySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'O nome precisa ter no mínimo um caracter.' }),
  description: z.string().nullable(),
  value: z.number().positive({ message: 'O valor precisa ser positivo.' }),
})

export type CreateAwardBody = z.infer<typeof createAwardBodySchema>

export const createAwardRequestSchema = z.object({
  params: createAwardParamsSchema,
  body: createAwardBodySchema,
})

export type CreateAwardRequest = z.infer<typeof createAwardRequestSchema>

export const createAwardResponseSchema = z.object({
  awardId: z.string().uuid(),
})

export type CreateAwardResponse = z.infer<typeof createAwardResponseSchema>
