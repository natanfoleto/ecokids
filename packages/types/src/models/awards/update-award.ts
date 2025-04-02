import { z } from 'zod'

export const updateAwardParamsSchema = z.object({
  schoolSlug: z.string(),
  awardId: z.string().uuid(),
})

export type UpdateAwardParams = z.infer<typeof updateAwardParamsSchema>

export const updateAwardBodySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'O nome precisa ter no mínimo um caracter.' }),
  description: z.string().optional(),
  value: z.number().positive({ message: 'O valor precisa ser positivo.' }),
})

export type UpdateAwardBody = z.infer<typeof updateAwardBodySchema>

export const updateAwardRequestSchema = z.object({
  body: updateAwardBodySchema,
  params: updateAwardParamsSchema,
})

export type UpdateAwardRequest = z.infer<typeof updateAwardRequestSchema>

export const updateAwardResponseSchema = z.null()

export type UpdateAwardResponse = z.infer<typeof updateAwardResponseSchema>
