import { z } from 'zod'

export const getStudentParamsSchema = z.object({
  schoolSlug: z.string(),
  studentId: z.string().uuid(),
})

export type GetStudentParams = z.infer<typeof getStudentParamsSchema>

export const getStudentRequestSchema = z.object({
  params: getStudentParamsSchema,
})

export type GetStudentRequest = z.infer<typeof getStudentRequestSchema>

export const getStudentResponseSchema = z.object({
  student: z.object({
    id: z.string().uuid(),
    code: z.number(),
    name: z.string(),
    cpf: z.string().nullable(),
    email: z.string().nullable(),
    classId: z.string().uuid(),
    createdAt: z.date(),
    updatedAt: z.date(),
    class: z.object({
      id: z.string().uuid(),
      name: z.string(),
      year: z.string(),
    }),
  }),
})

export type GetStudentResponse = z.infer<typeof getStudentResponseSchema>
