import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const updateMemberParamsSchema = z.object({
  schoolSlug: z.string(),
  memberId: z.string().uuid(),
})

export type UpdateMemberParams = z.infer<typeof updateMemberParamsSchema>

export const updateMemberBodySchema = z.object({
  role: roleSchema,
})

export type UpdateMemberBody = z.infer<typeof updateMemberBodySchema>

export const updateMemberRequestSchema = z.object({
  body: updateMemberBodySchema,
  params: updateMemberParamsSchema,
})

export type UpdateMemberRequest = z.infer<typeof updateMemberRequestSchema>

export const updateMemberResponseSchema = z.null()

export type UpdateMemberResponse = z.infer<typeof updateMemberResponseSchema>
