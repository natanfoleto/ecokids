import {
  getSeasonsParamsSchema,
  getSeasonsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getSeasons(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/seasons',
      {
        schema: {
          tags: ['Temporadas de Trocas'],
          summary: 'Listar o histórico de temporadas de trocas da escola',
          security: [{ bearerAuth: [] }],
          params: getSeasonsParamsSchema,
          response: {
            200: getSeasonsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const { school } = await request.getUserMembership(schoolSlug)

        const schoolSettings = await prisma.schoolSettings.findUnique({
          where: {
            schoolId: school.id,
          },
          select: {
            nextSeasonMessage: true,
          },
        })

        const seasons = await prisma.exchangeSeason.findMany({
          where: {
            schoolId: school.id,
          },
          orderBy: {
            openedAt: 'desc',
          },
        })

        const redemptionStats = await prisma.rewardRedemption.groupBy({
          by: ['seasonId', 'status'],
          where: {
            schoolId: school.id,
          },
          _count: {
            _all: true,
          },
          _sum: {
            pointsCost: true,
          },
        })

        const seasonsWithStats = seasons.map((season) => {
          const statsForSeason = redemptionStats.filter(
            (stat) => stat.seasonId === season.id,
          )

          let totalRedemptions = 0
          let approvedCount = 0
          let rejectedCount = 0
          let cancelledCount = 0
          let deliveredCount = 0
          let totalPointsCost = 0

          for (const stat of statsForSeason) {
            const count = stat._count._all ?? 0
            totalRedemptions += count

            if (stat.status === 'APPROVED') {
              approvedCount = count
            } else if (stat.status === 'REJECTED') {
              rejectedCount = count
            } else if (stat.status === 'CANCELLED') {
              cancelledCount = count
            } else if (stat.status === 'DELIVERED') {
              deliveredCount = count
            }

            totalPointsCost += stat._sum.pointsCost ?? 0
          }

          return {
            ...season,
            stats: {
              totalRedemptions,
              approvedCount,
              rejectedCount,
              cancelledCount,
              deliveredCount,
              totalPointsCost,
            },
          }
        })

        return reply.send({
          seasons: seasonsWithStats,
          nextSeasonMessage: schoolSettings?.nextSeasonMessage,
        })
      },
    )
}
