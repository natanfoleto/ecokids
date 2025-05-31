import { z } from 'zod'

export const createPointParamsSchema = z.object({
  schoolSlug: z.string(),
  studentId: z.string().uuid(),
})

export type CreatePointParams = z.infer<typeof createPointParamsSchema>

export const createPointBodySchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.string().uuid(),
        amount: z.number().min(1),
        value: z.number().min(1),
      }),
    )
    .min(1, { message: 'É necessário pelo menos um item para pontuar.' }),
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
