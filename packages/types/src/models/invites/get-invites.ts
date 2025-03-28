import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const getInvitesParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetInvitesParams = z.infer<typeof getInvitesParamsSchema>

export const getInvitesRequestSchema = z.object({
  params: getInvitesParamsSchema,
})

export type GetInvitesRequest = z.infer<typeof getInvitesRequestSchema>

export const getInvitesResponseSchema = z.object({
  invites: z.array(
    z.object({
      id: z.string().uuid(),
      role: roleSchema,
      email: z.string().email(),
      createdAt: z.date(),
      author: z
        .object({
          id: z.string().uuid(),
          name: z.string().nullable(),
        })
        .nullable(),
    }),
  ),
})

export type GetInvitesResponse = z.infer<typeof getInvitesResponseSchema>
