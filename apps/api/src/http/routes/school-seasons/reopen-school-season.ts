import {
  reopenSchoolSeasonParamsSchema,
  reopenSchoolSeasonResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function reopenSchoolSeason(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/school-seasons/reopen',
      {
        schema: {
          tags: ['Temporadas Escolares'],
          summary: 'Reabrir o último ciclo de pontuação encerrado',
          security: [{ bearerAuth: [] }],
          params: reopenSchoolSeasonParamsSchema,
          response: {
            200: reopenSchoolSeasonResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'SchoolSeason')) {
          throw new UnauthorizedError(
            'Você não tem permissão para gerenciar ciclos de pontuação.',
          )
        }

        // Find active season
        const currentActiveCycle = await prisma.schoolSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'ACTIVE',
          },
        })

        if (!currentActiveCycle) {
          throw new BadRequestError(
            'Não existe nenhum ciclo ativo para reabrir o anterior.',
          )
        }

        // Check if active season has points
        const pointsCount = await prisma.point.count({
          where: {
            seasonId: currentActiveCycle.id,
          },
        })

        if (pointsCount > 0) {
          throw new BadRequestError(
            'Não é possível reabrir um ciclo anterior pois o ciclo atual já possui pontuações registradas.',
          )
        }

        // Check if active season has redemptions
        const redemptionsCount = await prisma.rewardRedemption.count({
          where: {
            schoolSeasonId: currentActiveCycle.id,
          },
        })

        if (redemptionsCount > 0) {
          throw new BadRequestError(
            'Não é possível reabrir um ciclo anterior pois o ciclo atual já possui resgates registrados.',
          )
        }

        // Find last finished season by endedAt desc
        const lastFinishedSeason = await prisma.schoolSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'FINISHED',
          },
          orderBy: {
            endedAt: 'desc',
          },
        })

        if (!lastFinishedSeason) {
          throw new BadRequestError(
            'Não existe nenhum ciclo anterior encerrado para reabrir.',
          )
        }

        // Perform transaction
        await prisma.$transaction(async (tx) => {
          // Delete active cycle
          await tx.schoolSeason.delete({
            where: {
              id: currentActiveCycle.id,
            },
          })

          // Reopen last finished cycle to active
          await tx.schoolSeason.update({
            where: {
              id: lastFinishedSeason.id,
            },
            data: {
              status: 'ACTIVE',
              endedAt: null,
            },
          })
        })

        return reply.status(200).send({
          success: true,
        })
      },
    )
}
