import {
  createClassBodySchema,
  createClassParamsSchema,
  createClassResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createClass(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/classes',
      {
        schema: {
          tags: ['Classes'],
          summary: 'Criar uma classe',
          security: [{ bearerAuth: [] }],
          params: createClassParamsSchema,
          body: createClassBodySchema,
          response: {
            201: createClassResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { name, year } = request.body

        const userId = await request.getCurrentUserId()

        const { school, membership } = await request.getUserMembership(userId)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Class')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar novas classes.',
          )
        }

        const { id } = await prisma.class.create({
          data: {
            name,
            year,
            schoolId: school.id,
          },
          select: { id: true },
        })

        return reply.status(201).send({ classId: id })
      },
    )
}
