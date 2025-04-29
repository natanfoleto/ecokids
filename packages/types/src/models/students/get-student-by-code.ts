import { z } from 'zod'

export const getStudentByCodeParamsSchema = z.object({
  schoolSlug: z.string(),
  code: z.string(),
})

export type GetStudentByCodeParams = z.infer<
  typeof getStudentByCodeParamsSchema
>

export const getStudentByCodeRequestSchema = z.object({
  params: getStudentByCodeParamsSchema,
})

export type GetStudentByCodeRequest = z.infer<
  typeof getStudentByCodeRequestSchema
>

export const getStudentByCodeResponseSchema = z.object({
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
    points: z.array(
      z.object({
        id: z.string(),
        amount: z.number(),
        createdAt: z.date(),
      }),
    ),
    _count: z.object({
      points: z.number(),
    }),
  }),
})

export type GetStudentByCodeResponse = z.infer<
  typeof getStudentByCodeResponseSchema
>
