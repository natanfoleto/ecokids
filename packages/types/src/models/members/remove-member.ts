import { z } from 'zod'

export const removeMemberParamsSchema = z.object({
  schoolSlug: z.string(),
  memberId: z.string().uuid(),
})

export type RemoveMemberParams = z.infer<typeof removeMemberParamsSchema>

export const removeMemberRequestSchema = z.object({
  params: removeMemberParamsSchema,
})

export type RemoveMemberRequest = z.infer<typeof removeMemberRequestSchema>

export const removeMemberResponseSchema = z.null()

export type RemoveMemberResponse = z.infer<typeof removeMemberResponseSchema>
