import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const getPendingInvitesResponseSchema = z.object({
  invites: z.array(
    z.object({
      id: z.string().uuid(),
      role: roleSchema,
      email: z.string().email(),
      createdAt: z.date(),
      school: z.object({
        name: z.string(),
      }),
      author: z
        .object({
          id: z.string().uuid(),
          name: z.string().nullable(),
          avatarUrl: z.string().url().nullable(),
        })
        .nullable(),
    }),
  ),
})

export type GetPendingInvitesResponse = z.infer<
  typeof getPendingInvitesResponseSchema
>
