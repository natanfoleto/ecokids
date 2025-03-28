import { z } from 'zod'

export const acceptInviteParamsSchema = z.object({
  inviteId: z.string().uuid(),
})

export type AcceptInviteParams = z.infer<typeof acceptInviteParamsSchema>

const acceptRequestSchema = z.object({
  params: acceptInviteParamsSchema,
})

export type AcceptInviteRequest = z.infer<typeof acceptRequestSchema>

export const acceptInviteResponseSchema = z.null()

export type AcceptInviteResponse = z.infer<typeof acceptInviteResponseSchema>
