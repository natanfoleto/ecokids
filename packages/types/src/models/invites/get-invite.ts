import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const getInviteParamsSchema = z.object({
  inviteId: z.string().uuid(),
})

export type GetInviteParams = z.infer<typeof getInviteParamsSchema>

const getInviteRequestSchema = z.object({
  params: getInviteParamsSchema,
})

export type GetInviteRequest = z.infer<typeof getInviteRequestSchema>

export const getInviteResponseSchema = z.object({
  invite: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: roleSchema,
    createdAt: z.date(),
    school: z.object({
      name: z.string(),
    }),
    author: z
      .object({
        id: z.string().uuid(),
        name: z.string().nullable(),
      })
      .nullable(),
  }),
})

export type GetInviteResponse = z.infer<typeof getInviteResponseSchema>
