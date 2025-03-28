import { z } from 'zod'

export const shutdownSchoolParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type ShutdownSchoolParams = z.infer<typeof shutdownSchoolParamsSchema>

export const shutdownSchoolRequestSchema = z.object({
  params: shutdownSchoolParamsSchema,
})

export type ShutdownSchoolRequest = z.infer<typeof shutdownSchoolRequestSchema>

export const shutdownSchoolResponseSchema = z.null()

export type ShutdownSchoolResponse = z.infer<
  typeof shutdownSchoolResponseSchema
>
