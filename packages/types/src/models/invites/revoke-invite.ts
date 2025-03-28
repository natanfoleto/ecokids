import { z } from 'zod'

export const revokeInviteParamsSchema = z.object({
  schoolSlug: z.string(),
  conviteId: z.string().uuid(),
})

export type RevokeInviteParams = z.infer<typeof revokeInviteParamsSchema>

const revogarRequestSchema = z.object({
  params: revokeInviteParamsSchema,
})

export type RevokeInviteRequest = z.infer<typeof revogarRequestSchema>

export const revokeInviteResponseSchema = z.null()

export type RevokeInviteResponse = z.infer<typeof revokeInviteResponseSchema>
