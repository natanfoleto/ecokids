import {
  reopenSeasonParamsSchema,
  reopenSeasonResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function reopenSeason(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/seasons/:seasonId/reopen',
      {
        schema: {
          tags: ['Temporadas de Trocas'],
          summary: 'Reabrir a última temporada de trocas encerrada',
          security: [{ bearerAuth: [] }],
          params: reopenSeasonParamsSchema,
          response: {
            200: reopenSeasonResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, seasonId } = request.params

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'ExchangeSeason')) {
          throw new ForbiddenError(
            'Você não tem permissão para reabrir uma temporada de trocas.',
          )
        }

        // Validate that no active/OPEN season exists
        const openSeason = await prisma.exchangeSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'OPEN',
          },
        })

        if (openSeason) {
          throw new BadRequestError(
            'Já existe uma temporada aberta. Não é possível reabrir outra temporada.',
          )
        }

        // Find the last closed season
        const lastClosedSeason = await prisma.exchangeSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'CLOSED',
          },
          orderBy: {
            closedAt: 'desc',
          },
        })

        if (!lastClosedSeason) {
          throw new BadRequestError(
            'Não há nenhuma temporada encerrada para reabrir.',
          )
        }

        if (lastClosedSeason.id !== seasonId) {
          throw new BadRequestError(
            'Somente a última temporada encerrada pode ser reaberta.',
          )
        }

        // Transactional update
        await prisma.$transaction(async (tx) => {
          await tx.exchangeSeason.update({
            where: {
              id: seasonId,
            },
            data: {
              status: 'OPEN',
              closedAt: null,
            },
          })
        })

        return reply.status(200).send({ success: true })
      },
    )
}
