import { z } from 'zod'

export const getStudentProfileResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    email: z.string().email(),
  }),
})

export type GetStudentProfileResponse = z.infer<
  typeof getStudentProfileResponseSchema
>
