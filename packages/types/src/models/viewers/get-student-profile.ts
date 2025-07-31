import { z } from 'zod'

export const getStudentProfileResponseSchema = z.object({
  student: z.object({
    id: z.string().uuid(),
    code: z.number(),
    name: z.string(),
    cpf: z.string().nullable(),
    email: z.string().email().nullable(),
    school: z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
    class: z.object({
      id: z.string().uuid(),
      name: z.string(),
      year: z.string(),
    }),
    totalPoints: z.number(),
  }),
})

export type GetStudentProfileResponse = z.infer<
  typeof getStudentProfileResponseSchema
>
