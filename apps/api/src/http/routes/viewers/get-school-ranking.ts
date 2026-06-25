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
        const { classId, limit } = request.query

        const studentId = await request.getCurrentEntityId()

        // Find active school season
        const activeSchoolSeason = await prisma.schoolSeason.findFirst({
          where: {
            schoolId,
            status: 'ACTIVE',
          },
        })

        const students = await prisma.student.findMany({
          where: {
            schoolId,
            ...(classId ? { classId } : {}),
          },
          select: {
            id: true,
            name: true,
            points: {
              where: {
                seasonId: activeSchoolSeason?.id ?? '',
              },
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

        let studentStats = null

        const studentRankIndex = ranking.findIndex((r) => r.id === studentId)
        if (studentRankIndex !== -1) {
          const studentRank = ranking[studentRankIndex]
          const firstPlace = ranking[0]
          const nextPlace =
            studentRankIndex > 0 ? ranking[studentRankIndex - 1] : null

          studentStats = {
            position: studentRankIndex + 1,
            totalPoints: studentRank.totalPoints,
            pointsToFirst: firstPlace.totalPoints - studentRank.totalPoints,
            pointsToNext: nextPlace
              ? nextPlace.totalPoints - studentRank.totalPoints
              : null,
          }
        }

        const slicedRanking = limit ? ranking.slice(0, limit) : ranking

        return reply.send({ ranking: slicedRanking, studentStats })
      },
    )
}
