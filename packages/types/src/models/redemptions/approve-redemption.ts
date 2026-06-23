import { z } from 'zod'

export const approveRedemptionParamsSchema = z.object({
  schoolSlug: z.string(),
  redemptionId: z.string().uuid(),
})

export type ApproveRedemptionParams = z.infer<typeof approveRedemptionParamsSchema>

export const approveRedemptionBodySchema = z.object({
  pickupInstructions: z.string().nullable().optional(),
})

export type ApproveRedemptionBody = z.infer<typeof approveRedemptionBodySchema>

export const approveRedemptionRequestSchema = z.object({
  params: approveRedemptionParamsSchema,
  body: approveRedemptionBodySchema,
})

export type ApproveRedemptionRequest = z.infer<typeof approveRedemptionRequestSchema>

export const approveRedemptionResponseSchema = z.null()

export type ApproveRedemptionResponse = z.infer<typeof approveRedemptionResponseSchema>
