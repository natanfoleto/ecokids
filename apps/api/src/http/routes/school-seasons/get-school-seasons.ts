import {
  getSchoolSeasonsParamsSchema,
  getSchoolSeasonsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getSchoolSeasons(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/school-seasons',
      {
        schema: {
          tags: ['Temporadas Escolares'],
          summary: 'Listar ciclos de pontuação da escola com estatísticas',
          security: [{ bearerAuth: [] }],
          params: getSchoolSeasonsParamsSchema,
          response: {
            200: getSchoolSeasonsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { school } = await request.getUserMembership(schoolSlug)

        const rawSeasons = await prisma.schoolSeason.findMany({
          where: {
            schoolId: school.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        const seasons = await Promise.all(
          rawSeasons.map(async (season) => {
            // Aggregate total points
            const pointsAgg = await prisma.point.aggregate({
              where: { seasonId: season.id },
              _sum: { amount: true },
            })
            const totalPoints = pointsAgg._sum.amount ?? 0

            // Count unique students who scored
            const uniqueStudentsGroup = await prisma.point.groupBy({
              by: ['studentId'],
              where: { seasonId: season.id },
            })
            const uniqueStudentsCount = uniqueStudentsGroup.length

            // Count total redemptions
            const totalRedemptions = await prisma.rewardRedemption.count({
              where: { schoolSeasonId: season.id },
            })

            return {
              id: season.id,
              name: season.name,
              status: season.status,
              startedAt: season.startedAt,
              endedAt: season.endedAt,
              createdAt: season.createdAt,
              totalPoints,
              uniqueStudentsCount,
              totalRedemptions,
            }
          }),
        )

        return reply.status(200).send({ seasons })
      },
    )
}
