import { z } from 'zod'

export const rejectRedemptionParamsSchema = z.object({
  schoolSlug: z.string(),
  redemptionId: z.string().uuid(),
})

export type RejectRedemptionParams = z.infer<typeof rejectRedemptionParamsSchema>

export const rejectRedemptionBodySchema = z.object({
  rejectionReason: z.string().min(1, { message: 'A justificativa de rejeição é obrigatória.' }),
})

export type RejectRedemptionBody = z.infer<typeof rejectRedemptionBodySchema>

export const rejectRedemptionRequestSchema = z.object({
  params: rejectRedemptionParamsSchema,
  body: rejectRedemptionBodySchema,
})

export type RejectRedemptionRequest = z.infer<typeof rejectRedemptionRequestSchema>

export const rejectRedemptionResponseSchema = z.null()

export type RejectRedemptionResponse = z.infer<typeof rejectRedemptionResponseSchema>
