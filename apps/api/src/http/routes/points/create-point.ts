import {
  createPointBodySchema,
  createPointParamsSchema,
  createPointResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createPoint(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/students/:studentId/points',
      {
        schema: {
          tags: ['Pontos'],
          summary: 'Criar pontos para um estudante',
          security: [{ bearerAuth: [] }],
          params: createPointParamsSchema,
          body: createPointBodySchema,
          response: {
            201: createPointResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, studentId } = request.params
        const { amount } = request.body

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Point')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar pontos para um estudante.',
          )
        }

        const { id } = await prisma.point.create({
          data: {
            amount,
            studentId,
          },
        })

        return reply.status(201).send({ pointId: id })
      },
    )
}
