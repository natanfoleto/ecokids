import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const getMembersParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetMembersParams = z.infer<typeof getMembersParamsSchema>

export const getMembersRequestSchema = z.object({
  params: getMembersParamsSchema,
})

export type GetMembersRequest = z.infer<typeof getMembersRequestSchema>

export const getMembersResponseSchema = z.object({
  members: z.array(
    z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
      role: roleSchema,
      name: z.string().nullable(),
      email: z.string().email(),
      avatarUrl: z.string().url().nullable(),
    }),
  ),
})

export type GetMembersResponse = z.infer<typeof getMembersResponseSchema>
