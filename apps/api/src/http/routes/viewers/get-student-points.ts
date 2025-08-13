import { getStudentPointsResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getStudentPoints(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/viewers/students/points',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Buscar pontos do estudante autenticado',
          security: [{ bearerAuth: [] }],
          response: {
            200: getStudentPointsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const studentId = await request.getCurrentEntityId()

        const rawPoints = await prisma.point.findMany({
          where: {
            studentId,
          },
          select: {
            id: true,
            amount: true,
            createdAt: true,
            score_items: {
              select: {
                id: true,
                amount: true,
                value: true,
                item: {
                  select: {
                    id: true,
                    name: true,
                    photoUrl: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        const points = rawPoints.map((point) => ({
          ...point,
          scoreItems: point.score_items,
          score_items: undefined,
        }))

        const totalPoints = rawPoints.reduce((sum, point) => {
          return sum + point.amount
        }, 0)

        return reply.send({ points, totalPoints })
      },
    )
}
