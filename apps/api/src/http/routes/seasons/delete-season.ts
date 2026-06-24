import {
  deleteSeasonParamsSchema,
  deleteSeasonResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteSeason(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/schools/:schoolSlug/seasons/:seasonId',
      {
        schema: {
          tags: ['Temporadas de Trocas'],
          summary: 'Excluir uma temporada de trocas',
          security: [{ bearerAuth: [] }],
          params: deleteSeasonParamsSchema,
          response: {
            204: deleteSeasonResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, seasonId } = request.params

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'ExchangeSeason')) {
          throw new ForbiddenError(
            'Você não tem permissão para excluir uma temporada de trocas.',
          )
        }

        const season = await prisma.exchangeSeason.findFirst({
          where: {
            id: seasonId,
            schoolId: school.id,
          },
        })

        if (!season) {
          throw new BadRequestError('Temporada de trocas não encontrada.')
        }

        // Validate that no redemptions are linked
        const redemptionsCount = await prisma.rewardRedemption.count({
          where: {
            seasonId,
          },
        })

        if (redemptionsCount > 0) {
          throw new BadRequestError(
            'Não é possível excluir esta temporada pois existem resgates vinculados.',
          )
        }

        // Validate that this is not the only season in the system
        const seasonsCount = await prisma.exchangeSeason.count({
          where: {
            schoolId: school.id,
          },
        })

        if (seasonsCount === 1) {
          throw new BadRequestError(
            'Não é possível excluir esta temporada pois a escola deve ter pelo menos uma temporada de trocas.',
          )
        }

        // Permanent deletion (real delete)
        await prisma.exchangeSeason.delete({
          where: {
            id: seasonId,
          },
        })

        return reply.status(204).send()
      },
    )
}
