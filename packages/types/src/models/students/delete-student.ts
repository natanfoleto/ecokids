import { z } from 'zod'

export const deleteStudentParamsSchema = z.object({
  schoolSlug: z.string(),
  studentId: z.string().uuid(),
})

export type DeleteStudentParams = z.infer<typeof deleteStudentParamsSchema>

export const deleteStudentRequestSchema = z.object({
  params: deleteStudentParamsSchema,
})

export type DeleteStudentRequest = z.infer<typeof deleteStudentRequestSchema>

export const deleteStudentResponseSchema = z.null()

export type DeleteStudentResponse = z.infer<typeof deleteStudentResponseSchema>
