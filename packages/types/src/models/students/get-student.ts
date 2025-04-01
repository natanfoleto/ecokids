import { z } from 'zod'

export const getStudentParamsSchema = z.object({
  schoolSlug: z.string(),
  classId: z.string().uuid(),
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
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export type GetStudentResponse = z.infer<typeof getStudentResponseSchema>
