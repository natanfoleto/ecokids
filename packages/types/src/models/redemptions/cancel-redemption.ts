import { z } from 'zod'

export const cancelRedemptionParamsSchema = z.object({
  redemptionId: z.string().uuid(),
})

export type CancelRedemptionParams = z.infer<typeof cancelRedemptionParamsSchema>

export const cancelRedemptionRequestSchema = z.object({
  params: cancelRedemptionParamsSchema,
})

export type CancelRedemptionRequest = z.infer<typeof cancelRedemptionRequestSchema>

export const cancelRedemptionResponseSchema = z.null()

export type CancelRedemptionResponse = z.infer<typeof cancelRedemptionResponseSchema>
