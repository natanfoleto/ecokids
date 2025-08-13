import {
  getSchoolRankingParamsSchema,
  getSchoolRankingQuerySchema,
  getSchoolRankingResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getSchoolRanking(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/viewers/schools/:schoolId/ranking',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Buscar o ranking de estudantes de uma escola',
          security: [{ bearerAuth: [] }],
          params: getSchoolRankingParamsSchema,
          querystring: getSchoolRankingQuerySchema,
          response: {
            200: getSchoolRankingResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolId } = request.params
        const { classId } = request.query

        const students = await prisma.student.findMany({
          where: {
            schoolId,
            ...(classId ? { classId } : {}),
          },
          select: {
            id: true,
            name: true,
            points: {
              select: {
                amount: true,
              },
            },
          },
        })

        const ranking = students
          .map((student) => ({
            id: student.id,
            name: student.name,
            totalPoints: student.points.reduce(
              (sum, point) => sum + point.amount,
              0,
            ),
          }))
          .sort((a, b) => b.totalPoints - a.totalPoints)

        return reply.send({ ranking })
      },
    )
}
