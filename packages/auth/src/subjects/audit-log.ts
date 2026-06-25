import { z } from 'zod'

export const auditLogSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('get')]),
  z.literal('AuditLog'),
])

export type AuditLogSubject = z.infer<typeof auditLogSubject>
