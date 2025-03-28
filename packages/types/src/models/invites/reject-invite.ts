import { z } from 'zod'

export const rejectInviteParamsSchema = z.object({
  inviteId: z.string().uuid(),
})

export type RejectInviteParams = z.infer<typeof rejectInviteParamsSchema>

export const rejeitarRequestSchema = z.object({
  params: rejectInviteParamsSchema,
})

export type RejectInviteRequest = z.infer<typeof rejeitarRequestSchema>

export const rejectInviteResponseSchema = z.null()

export type RejectInviteResponse = z.infer<typeof rejectInviteResponseSchema>
