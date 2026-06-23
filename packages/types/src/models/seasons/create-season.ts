import { z } from 'zod'

export const createSeasonParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type CreateSeasonParams = z.infer<typeof createSeasonParamsSchema>

export const createSeasonBodySchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  description: z.string().nullable().optional(),
})

export type CreateSeasonBody = z.infer<typeof createSeasonBodySchema>

export const createSeasonRequestSchema = z.object({
  params: createSeasonParamsSchema,
  body: createSeasonBodySchema,
})

export type CreateSeasonRequest = z.infer<typeof createSeasonRequestSchema>

export const createSeasonResponseSchema = z.object({
  seasonId: z.string().uuid(),
})

export type CreateSeasonResponse = z.infer<typeof createSeasonResponseSchema>
