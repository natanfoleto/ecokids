import { z } from 'zod'

export const deleteClassParamsSchema = z.object({
  schoolSlug: z.string(),
  classId: z.string().uuid(),
})

export type DeleteClassParams = z.infer<typeof deleteClassParamsSchema>

const deleteClassRequestSchema = z.object({
  params: deleteClassParamsSchema,
})

export const deleteClassResponseSchema = z.null()

export type DeleteClassRequest = z.infer<typeof deleteClassRequestSchema>
