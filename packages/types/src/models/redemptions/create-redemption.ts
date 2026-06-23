import { z } from 'zod'

export const createRedemptionParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CreateRedemptionParams = z.infer<typeof createRedemptionParamsSchema>

export const createRedemptionBodySchema = z.object({
  awardId: z.string().uuid({ message: 'Selecione um prêmio válido.' }),
})

export type CreateRedemptionBody = z.infer<typeof createRedemptionBodySchema>

export const createRedemptionRequestSchema = z.object({
  params: createRedemptionParamsSchema,
  body: createRedemptionBodySchema,
})

export type CreateRedemptionRequest = z.infer<typeof createRedemptionRequestSchema>

export const createRedemptionResponseSchema = z.object({
  redemptionId: z.string().uuid(),
})

export type CreateRedemptionResponse = z.infer<typeof createRedemptionResponseSchema>
