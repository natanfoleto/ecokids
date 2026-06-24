import {
  getSchoolSeasonReportParamsSchema,
  getSchoolSeasonReportQuerySchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { generateSchoolSeasonPdf } from '@/utils/generate-school-season-pdf'

export async function getSchoolSeasonReport(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/school-seasons/:seasonId/report',
      {
        schema: {
          tags: ['Temporadas Escolares'],
          summary: 'Gerar relatório PDF de um ciclo de pontuação',
          security: [{ bearerAuth: [] }],
          params: getSchoolSeasonReportParamsSchema,
          querystring: getSchoolSeasonReportQuerySchema,
        },
      },
      async (request, reply) => {
        const { schoolSlug, seasonId } = request.params
        const { type } = request.query
        const { school } = await request.getUserMembership(schoolSlug)

        // Find the school season
        const season = await prisma.schoolSeason.findFirst({
          where: {
            id: seasonId,
            schoolId: school.id,
          },
        })

        if (!season) {
          throw new BadRequestError('Ciclo de pontuação não encontrado.')
        }

        // 1. Stats aggregates
        const pointsAgg = await prisma.point.aggregate({
          where: { seasonId },
          _sum: { amount: true },
        })
        const totalPoints = pointsAgg._sum.amount ?? 0

        const itemsAgg = await prisma.scoreItems.aggregate({
          where: {
            point: { seasonId },
          },
          _sum: { amount: true },
        })
        const totalItemsRecycled = itemsAgg._sum.amount ?? 0

        const collectionsCount = await prisma.point.count({
          where: { seasonId },
        })

        const uniqueStudents = await prisma.point.groupBy({
          by: ['studentId'],
          where: { seasonId },
        })
        const participantsCount = uniqueStudents.length

        // 1.1 Classrooms Leaderboard in this season
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
                    seasonId,
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

        // 1.2 Most Recycled Items in this season
        const scoreItemsGrouped = await prisma.scoreItems.groupBy({
          by: ['itemId'],
          where: {
            point: {
              seasonId,
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

        // 2. Ranking
        const studentsWithPoints = await prisma.student.findMany({
          where: {
            schoolId: school.id,
            points: {
              some: {
                seasonId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            class: {
              select: {
                name: true,
              },
            },
            points: {
              where: {
                seasonId,
              },
              select: {
                amount: true,
              },
            },
          },
        })

        const ranking = studentsWithPoints
          .map((s) => {
            const studentTotalPoints = s.points.reduce(
              (sum, p) => sum + p.amount,
              0,
            )
            return {
              id: s.id,
              name: s.name,
              className: s.class.name,
              totalPoints: studentTotalPoints,
            }
          })
          .sort((a, b) => b.totalPoints - a.totalPoints)

        // 3. Detailed History per Student (only loaded if report type is complete)
        let studentsHistory: any[] = []

        if (type !== 'simple') {
          const studentsHistoryData = await prisma.student.findMany({
            where: {
              schoolId: school.id,
              points: {
                some: {
                  seasonId,
                },
              },
            },
            select: {
              id: true,
              name: true,
              class: {
                select: {
                  name: true,
                },
              },
              points: {
                where: {
                  seasonId,
                },
                orderBy: {
                  createdAt: 'desc',
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
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: {
              name: 'asc',
            },
          })

          studentsHistory = studentsHistoryData.map((s) => {
            const studentTotalPoints = s.points.reduce(
              (sum, p) => sum + p.amount,
              0,
            )
            return {
              id: s.id,
              name: s.name,
              className: s.class.name,
              totalPoints: studentTotalPoints,
              points: s.points.map((p) => ({
                id: p.id,
                amount: p.amount,
                createdAt: p.createdAt,
                scoreItems: p.score_items.map((si) => ({
                  id: si.id,
                  amount: si.amount,
                  value: si.value,
                  itemName: si.item.name,
                })),
              })),
            }
          })
        }

        // Generate PDF
        const pdfBuffer = await generateSchoolSeasonPdf({
          school: {
            name: school.name,
          },
          season: {
            name: season.name,
            status: season.status,
            startedAt: season.startedAt,
            endedAt: season.endedAt,
          },
          stats: {
            totalPoints,
            totalItemsRecycled,
            participantsCount,
            collectionsCount,
          },
          classroomsLeaderboard,
          mostRecycledItems,
          ranking,
          studentsHistory,
          isSimple: type === 'simple',
        })

        reply
          .header('Content-Type', 'application/pdf')
          .header(
            'Content-Disposition',
            `attachment; filename="relatorio-${season.name.replace(/\s+/g, '-')}.pdf"`,
          )
          .send(pdfBuffer)
      },
    )
}
