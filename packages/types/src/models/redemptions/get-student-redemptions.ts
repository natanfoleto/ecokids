import { z } from 'zod'

export const getStudentRedemptionsResponseSchema = z.object({
  redemptions: z.array(
    z.object({
      id: z.string().uuid(),
      pointsCost: z.number(),
      status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'DELIVERED']),
      createdAt: z.date(),
      approvedAt: z.date().nullable(),
      rejectedAt: z.date().nullable(),
      deliveredAt: z.date().nullable(),
      cancelledAt: z.date().nullable(),
      rejectionReason: z.string().nullable(),
      pickupInstructions: z.string().nullable(),
      award: z.object({
        id: z.string().uuid(),
        name: z.string(),
        value: z.number(),
        photoUrl: z.string().url().nullable(),
      }),
    }),
  ),
})

export type GetStudentRedemptionsResponse = z.infer<
  typeof getStudentRedemptionsResponseSchema
>
