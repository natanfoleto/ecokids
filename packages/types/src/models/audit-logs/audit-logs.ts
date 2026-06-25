import { z } from 'zod'

import { paginationMetaSchema, paginationQuerySchema } from '../pagination'

export const getAuditLogsParamsSchema = z.object({
  schoolSlug: z.string(),
})

export type GetAuditLogsParams = z.infer<typeof getAuditLogsParamsSchema>

export const getAuditLogsQuerySchema = paginationQuerySchema.extend({
  actorId: z.string().optional(),
  actorType: z.string().optional(),
  entityType: z.string().optional(),
  action: z.string().optional(),
  period: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type GetAuditLogsQuery = z.infer<typeof getAuditLogsQuerySchema>

export const getAuditLogsRequestSchema = z.object({
  params: getAuditLogsParamsSchema,
  query: getAuditLogsQuerySchema.optional(),
})

export type GetAuditLogsRequest = z.infer<typeof getAuditLogsRequestSchema>

export const auditLogSchema = z.object({
  id: z.string().uuid(),
  schoolId: z.string().uuid().nullable(),
  actorId: z.string().nullable(),
  actorType: z.string(),
  entityType: z.string(),
  entityId: z.string().nullable(),
  action: z.string(),
  description: z.string(),
  oldData: z.any().nullable(),
  newData: z.any().nullable(),
  metadata: z.any().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.coerce.date(),
  actor: z
    .object({
      name: z.string(),
      email: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
})

export type AuditLogType = z.infer<typeof auditLogSchema>

export const getAuditLogsResponseSchema = z.object({
  auditLogs: z.array(auditLogSchema),
  meta: paginationMetaSchema,
})

export type GetAuditLogsResponse = z.infer<typeof getAuditLogsResponseSchema>
