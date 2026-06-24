import { z } from 'zod'

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
})

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  pageCount: z.number(),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>
export type PaginationMeta = z.infer<typeof paginationMetaSchema>
