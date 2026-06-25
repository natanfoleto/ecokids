import type { FastifyInstance } from 'fastify/types/instance'
import { ZodError } from 'zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { recordAuditLog } from '@/lib/audit-service'
import { requestContextStorage } from '@/lib/request-context'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    request.log.warn(error)

    return reply.status(400).send({
      message: 'Erro de validação',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  if (error instanceof ForbiddenError) {
    const store = requestContextStorage.getStore()
    const actorId = store?.actorId || null
    const actorType = store?.actorType || 'USER'
    const schoolId = store?.schoolId || null

    recordAuditLog({
      schoolId,
      actorId,
      actorType,
      entityType: 'Security',
      action: 'SECURITY_VIOLATION',
      description: `Acesso negado: ${error.message} Rota: ${request.method} ${request.url}`,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'] || null,
    })

    return reply.status(403).send({
      message: error.message,
    })
  }

  if (error.code === 'FST_REQ_FILE_TOO_LARGE') {
    return reply.status(413).send({
      message:
        'A imagem enviada é muito pesada. O limite máximo permitido é de 1MB.',
    })
  }

  request.log.error(error)

  // send error to some abservability platform

  return reply.status(500).send({
    message: 'Internal server error',
  })
}
