import { roleSchema } from '@ecokids/auth'
import { z } from 'zod'

export const createInviteParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CreateInviteParams = z.infer<typeof createInviteParamsSchema>

export const createInviteBodySchema = z.object({
  email: z.string().email({ message: 'Insira um e-mail válido.' }),
  role: roleSchema,
})

export type CreateInviteBody = z.infer<typeof createInviteBodySchema>

export const createInviteResponseSchema = z.object({
  inviteId: z.string().uuid(),
})

export type CreateInviteResponse = z.infer<typeof createInviteResponseSchema>

const criarRequestSchema = z.object({
  body: createInviteBodySchema,
  params: createInviteParamsSchema,
})

export type CreateInviteRequest = z.infer<typeof criarRequestSchema>
