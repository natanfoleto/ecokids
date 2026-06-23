import {
  createRedemptionBodySchema,
  createRedemptionParamsSchema,
  createRedemptionResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function createRedemption(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/viewers/schools/:schoolSlug/redemptions',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Solicitar o resgate de um prêmio',
          security: [{ bearerAuth: [] }],
          params: createRedemptionParamsSchema,
          body: createRedemptionBodySchema,
          response: {
            201: createRedemptionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const studentId = await request.getCurrentEntityId()
        const { schoolSlug } = request.params
        const { awardId } = request.body

        // Get student and verify school association
        const student = await prisma.student.findUnique({
          where: { id: studentId },
          include: { school: true },
        })

        if (!student) {
          throw new BadRequestError('Estudante não encontrado.')
        }

        if (student.school.slug !== schoolSlug) {
          throw new BadRequestError(
            'A escola informada é inválida para este estudante.',
          )
        }

        // Verify active season
        const activeSeason = await prisma.exchangeSeason.findFirst({
          where: {
            schoolId: student.schoolId,
            status: 'OPEN',
          },
        })

        if (!activeSeason) {
          throw new BadRequestError(
            'Não há nenhuma temporada de trocas ativa no momento nesta escola.',
          )
        }

        // Verify active school points season
        const activeSchoolSeason = await prisma.schoolSeason.findFirst({
          where: {
            schoolId: student.schoolId,
            status: 'ACTIVE',
          },
        })

        if (!activeSchoolSeason) {
          throw new BadRequestError(
            'Não há nenhum ciclo de pontuação ativo nesta escola no momento.',
          )
        }

        // Verify award existence in school
        const award = await prisma.award.findFirst({
          where: {
            id: awardId,
            schoolId: student.schoolId,
          },
        })

        if (!award) {
          throw new BadRequestError('Prêmio não encontrado na escola.')
        }

        // Execute dynamic balance check and creation within a transaction
        const redemption = await prisma.$transaction(async (tx) => {
          const totalPointsAgg = await tx.point.aggregate({
            where: { studentId, seasonId: activeSchoolSeason.id },
            _sum: { amount: true },
          })
          const totalPoints = totalPointsAgg._sum.amount ?? 0

          const reservedPointsAgg = await tx.rewardRedemption.aggregate({
            where: {
              studentId,
              status: 'PENDING',
              schoolSeasonId: activeSchoolSeason.id,
            },
            _sum: { pointsCost: true },
          })
          const reservedPoints = reservedPointsAgg._sum.pointsCost ?? 0

          const consumedPointsAgg = await tx.rewardRedemption.aggregate({
            where: {
              studentId,
              status: { in: ['APPROVED', 'DELIVERED'] },
              schoolSeasonId: activeSchoolSeason.id,
            },
            _sum: { pointsCost: true },
          })
          const consumedPoints = consumedPointsAgg._sum.pointsCost ?? 0

          const availablePoints = totalPoints - reservedPoints - consumedPoints

          if (availablePoints < award.value) {
            throw new BadRequestError(
              `Saldo de pontos insuficiente. Você precisa de ${award.value} pontos, mas tem apenas ${availablePoints} disponíveis.`,
            )
          }

          return tx.rewardRedemption.create({
            data: {
              pointsCost: award.value,
              status: 'PENDING',
              studentId,
              awardId,
              schoolId: student.schoolId,
              seasonId: activeSeason.id,
              schoolSeasonId: activeSchoolSeason.id,
            },
          })
        })

        return reply.status(201).send({ redemptionId: redemption.id })
      },
    )
}
