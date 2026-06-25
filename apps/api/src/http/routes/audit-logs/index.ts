import { FastifyInstance } from 'fastify'

import { getAuditLogs } from './get-audit-logs'

export async function registerAuditLogsRoutes(app: FastifyInstance) {
  app.register(getAuditLogs)
}
