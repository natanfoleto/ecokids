import { z } from 'zod'

export const createPointParamsSchema = z.object({
  schoolSlug: z.string(),
  studentId: z.string().uuid(),
})

export type CreatePointParams = z.infer<typeof createPointParamsSchema>

export const createPointBodySchema = z.object({
  amount: z
    .number({ message: 'Por favor, digite um número válido para pontuar.' })
    .min(1, { message: 'O número mínimo para pontuar é de 1 ponto.' }),
})

export type CreatePointBody = z.infer<typeof createPointBodySchema>

export const createPointRequestSchema = z.object({
  params: createPointParamsSchema,
  body: createPointBodySchema,
})

export type CreatePointRequest = z.infer<typeof createPointRequestSchema>

export const createPointResponseSchema = z.object({
  pointId: z.string().uuid(),
})

export type CreatePointResponse = z.infer<typeof createPointResponseSchema>
