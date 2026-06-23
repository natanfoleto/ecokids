import { z } from 'zod'

export const getSeasonsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetSeasonsParams = z.infer<typeof getSeasonsParamsSchema>

export const getSeasonsRequestSchema = z.object({
  params: getSeasonsParamsSchema,
})

export type GetSeasonsRequest = z.infer<typeof getSeasonsRequestSchema>

export const getSeasonsResponseSchema = z.object({
  seasons: z.array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      description: z.string().nullable(),
      status: z.enum(['OPEN', 'CLOSED']),
      openedAt: z.date(),
      closedAt: z.date().nullable(),
    }),
  ),
})

export type GetSeasonsResponse = z.infer<typeof getSeasonsResponseSchema>
