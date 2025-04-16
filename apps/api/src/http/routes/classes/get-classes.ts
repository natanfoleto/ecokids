import {
  getClassesParamsSchema,
  getClassesResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getClasses(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/classes',
      {
        schema: {
          tags: ['Turmas'],
          summary: 'Buscar todas as turmas de uma escola',
          security: [{ bearerAuth: [] }],
          params: getClassesParamsSchema,
          response: {
            200: getClassesResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentUserId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Class')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar turmas dessa escola.',
          )
        }

        const classes = await prisma.class.findMany({
          where: {
            schoolId: school.id,
          },
          select: {
            id: true,
            name: true,
            year: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        return reply.send({ classes })
      },
    )
}
