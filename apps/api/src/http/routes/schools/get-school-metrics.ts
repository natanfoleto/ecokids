import {
  getSchoolMetricsParamsSchema,
  getSchoolMetricsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getSchoolMetrics(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/metrics',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Buscar métricas de engajamento de uma escola',
          security: [{ bearerAuth: [] }],
          params: getSchoolMetricsParamsSchema,
          response: {
            200: getSchoolMetricsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const { school } = await request.getUserMembership(schoolSlug)

        // Find active school season
        const activeSchoolSeason = await prisma.schoolSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'ACTIVE',
          },
        })

        // 1. Total active students
        const totalStudents = await prisma.student.count({
          where: { schoolId: school.id, active: true },
        })

        // 2. Inactive students (active students with 0 points in active season)
        const inactiveStudentsCount = await prisma.student.count({
          where: {
            schoolId: school.id,
            active: true,
            points: {
              none: {
                seasonId: activeSchoolSeason?.id ?? '',
              },
            },
          },
        })

        // 3. Participation count (active students with at least 1 point in active season)
        const activeStudentsWithPointsCount = await prisma.student.count({
          where: {
            schoolId: school.id,
            active: true,
            points: {
              some: {
                seasonId: activeSchoolSeason?.id ?? '',
              },
            },
          },
        })

        const participationPercentage =
          totalStudents > 0
            ? Math.round((activeStudentsWithPointsCount / totalStudents) * 100)
            : 0

        // 4. Total points generated in active season
        const pointsSum = await prisma.point.aggregate({
          where: {
            student: { schoolId: school.id },
            seasonId: activeSchoolSeason?.id ?? '',
          },
          _sum: {
            amount: true,
          },
        })
        const totalPoints = pointsSum._sum.amount ?? 0

        // 5. Total items recycled in active season
        const itemsSum = await prisma.scoreItems.aggregate({
          where: {
            point: {
              student: { schoolId: school.id },
              seasonId: activeSchoolSeason?.id ?? '',
            },
          },
          _sum: {
            amount: true,
          },
        })
        const totalItemsRecycled = itemsSum._sum.amount ?? 0

        // 6. Classrooms Leaderboard in active season
        const classes = await prisma.class.findMany({
          where: { schoolId: school.id },
          select: {
            id: true,
            name: true,
            year: true,
            students: {
              select: {
                id: true,
                points: {
                  where: {
                    seasonId: activeSchoolSeason?.id ?? '',
                  },
                  select: {
                    amount: true,
                  },
                },
              },
            },
          },
        })

        const classroomsLeaderboard = classes
          .map((cls) => {
            const studentsCount = cls.students.length
            const studentsWithPointsCount = cls.students.filter(
              (s) => s.points.length > 0,
            ).length
            const classTotalPoints = cls.students.reduce(
              (sum, s) =>
                sum + s.points.reduce((pSum, p) => pSum + p.amount, 0),
              0,
            )
            const participationRate =
              studentsCount > 0
                ? Math.round((studentsWithPointsCount / studentsCount) * 100)
                : 0

            return {
              id: cls.id,
              name: cls.name,
              year: cls.year,
              totalPoints: classTotalPoints,
              studentsCount,
              participationRate,
            }
          })
          .sort((a, b) => b.totalPoints - a.totalPoints)

        // 7. Most Recycled Items in active season
        const scoreItemsGrouped = await prisma.scoreItems.groupBy({
          by: ['itemId'],
          where: {
            point: {
              student: { schoolId: school.id },
              seasonId: activeSchoolSeason?.id ?? '',
            },
          },
          _sum: {
            amount: true,
          },
        })

        const items = await prisma.item.findMany({
          where: { schoolId: school.id },
          select: {
            id: true,
            name: true,
            value: true,
          },
        })

        const mostRecycledItems = scoreItemsGrouped
          .map((group) => {
            const item = items.find((i) => i.id === group.itemId)
            return {
              id: group.itemId,
              name: item?.name ?? 'Item desconhecido',
              totalQuantity: group._sum.amount ?? 0,
              pointsValue: item?.value ?? 0,
            }
          })
          .sort((a, b) => b.totalQuantity - a.totalQuantity)

        // 8. Recent Activity in active season
        const recentPoints = await prisma.point.findMany({
          where: {
            student: { schoolId: school.id },
            seasonId: activeSchoolSeason?.id ?? '',
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            amount: true,
            createdAt: true,
            student: {
              select: {
                name: true,
                class: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            score_items: {
              select: {
                amount: true,
              },
            },
          },
        })

        const recentActivity = recentPoints.map((point) => ({
          id: point.id,
          studentName: point.student.name,
          className: point.student.class.name,
          pointsAmount: point.amount,
          createdAt: point.createdAt,
          itemsCount: point.score_items.reduce(
            (sum, item) => sum + item.amount,
            0,
          ),
        }))

        return reply.send({
          metrics: {
            totalStudents,
            totalPoints,
            totalItemsRecycled,
            participationPercentage,
            inactiveStudentsCount,
          },
          classroomsLeaderboard,
          mostRecycledItems,
          recentActivity,
        })
      },
    )
}
