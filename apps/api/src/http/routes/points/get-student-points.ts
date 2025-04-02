import {
  getStudentPointsParamsSchema,
  getStudentPointsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getStudentPoints(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/students/:studentId/points',
      {
        schema: {
          tags: ['Pontos'],
          summary: 'Buscar os pontos de um estudante',
          security: [{ bearerAuth: [] }],
          params: getStudentPointsParamsSchema,
          response: {
            200: getStudentPointsResponseSchema,
          },
        },
      },
      async (request, response) => {
        const { schoolSlug, studentId } = request.params

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Point')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar os pontos de um estudante.',
          )
        }

        const points = await prisma.point.findMany({
          where: {
            studentId,
          },
          select: {
            id: true,
            amount: true,
            createdAt: true,
          },
        })

        return response.send({
          points,
        })
      },
    )
}
