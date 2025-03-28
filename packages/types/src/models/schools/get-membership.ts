import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const getMembershipParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetMembershipParams = z.infer<typeof getMembershipParamsSchema>

export const getMembershipRequestSchema = z.object({
  params: getMembershipParamsSchema,
})

export type GetMembershipRequest = z.infer<typeof getMembershipRequestSchema>

export const getMembershipResponseSchema = z.object({
  membership: z.object({
    id: z.string().uuid(),
    role: roleSchema,
    userId: z.string().uuid(),
    schoolId: z.string().uuid(),
  }),
})

export type GetMembershipResponse = z.infer<typeof getMembershipResponseSchema>
