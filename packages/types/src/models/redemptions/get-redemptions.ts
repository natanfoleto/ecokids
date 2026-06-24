import { z } from 'zod'

import { paginationMetaSchema, paginationQuerySchema } from '../pagination'

export const getRedemptionsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetRedemptionsParams = z.infer<typeof getRedemptionsParamsSchema>

export const getRedemptionsQuerySchema = paginationQuerySchema.extend({
  status: z.string().optional(),
})

export const getRedemptionsRequestSchema = z.object({
  params: getRedemptionsParamsSchema,
  query: getRedemptionsQuerySchema.optional(),
})

export type GetRedemptionsRequest = z.infer<typeof getRedemptionsRequestSchema>

export const getRedemptionsResponseSchema = z.object({
  redemptions: z.array(
    z.object({
      id: z.string().uuid(),
      pointsCost: z.number(),
      status: z.enum([
        'PENDING',
        'APPROVED',
        'REJECTED',
        'CANCELLED',
        'DELIVERED',
      ]),
      createdAt: z.date(),
      approvedAt: z.date().nullable(),
      rejectedAt: z.date().nullable(),
      deliveredAt: z.date().nullable(),
      cancelledAt: z.date().nullable(),
      rejectionReason: z.string().nullable(),
      pickupInstructions: z.string().nullable(),
      student: z.object({
        id: z.string(),
        name: z.string(),
        code: z.number(),
        class: z.object({
          name: z.string(),
          year: z.string(),
        }),
      }),
      award: z.object({
        id: z.string().uuid(),
        name: z.string(),
        value: z.number(),
        photoUrl: z.string().url().nullable(),
      }),
    }),
  ),
  meta: paginationMetaSchema,
})

export type GetRedemptionsResponse = z.infer<
  typeof getRedemptionsResponseSchema
>
