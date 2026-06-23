import { z } from 'zod'

export const deliverRedemptionParamsSchema = z.object({
  schoolSlug: z.string(),
  redemptionId: z.string().uuid(),
})

export type DeliverRedemptionParams = z.infer<
  typeof deliverRedemptionParamsSchema
>

export const deliverRedemptionRequestSchema = z.object({
  params: deliverRedemptionParamsSchema,
})

export type DeliverRedemptionRequest = z.infer<
  typeof deliverRedemptionRequestSchema
>

export const deliverRedemptionResponseSchema = z.null()

export type DeliverRedemptionResponse = z.infer<
  typeof deliverRedemptionResponseSchema
>
