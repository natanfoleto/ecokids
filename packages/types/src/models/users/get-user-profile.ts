import { z } from 'zod'

export const getUserProfileResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    cpf: z.string(),
    avatarUrl: z.string().url().nullable(),
  }),
})

export type GetUserProfileResponse = z.infer<
  typeof getUserProfileResponseSchema
>
