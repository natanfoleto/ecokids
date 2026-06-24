import {
  resetSchoolSeasonParamsSchema,
  resetSchoolSeasonResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function resetSchoolSeason(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/school-seasons/reset',
      {
        schema: {
          tags: ['Temporadas Escolares'],
          summary: 'Resetar o ciclo de pontuação ativo atual',
          security: [{ bearerAuth: [] }],
          params: resetSchoolSeasonParamsSchema,
          response: {
            200: resetSchoolSeasonResponseSchema,
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
          throw new ForbiddenError(
            'Você não tem permissão para gerenciar ciclos de pontuação.',
          )
        }

        // Find active season
        const activeSeason = await prisma.schoolSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'ACTIVE',
          },
        })

        if (!activeSeason) {
          throw new BadRequestError(
            'Não existe nenhum ciclo de pontuação ativo para resetar.',
          )
        }

        // Check if there are any redemptions in active cycle
        const redemptionsCount = await prisma.rewardRedemption.count({
          where: {
            schoolSeasonId: activeSeason.id,
          },
        })

        if (redemptionsCount > 0) {
          throw new BadRequestError(
            'Não é possível resetar este ciclo pois existem resgates vinculados.',
          )
        }

        // Perform transaction
        await prisma.$transaction(async (tx) => {
          // Delete ScoreItems associated with points of the active season
          await tx.scoreItems.deleteMany({
            where: {
              point: {
                seasonId: activeSeason.id,
              },
            },
          })

          // Delete Points of the active season
          await tx.point.deleteMany({
            where: {
              seasonId: activeSeason.id,
            },
          })
        })

        return reply.status(200).send({
          success: true,
        })
      },
    )
}
