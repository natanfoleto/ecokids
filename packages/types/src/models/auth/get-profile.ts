import { z } from 'zod'

export const getProfileResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    email: z.string().email(),
  }),
})

export type GetProfileResponse = z.infer<typeof getProfileResponseSchema>
