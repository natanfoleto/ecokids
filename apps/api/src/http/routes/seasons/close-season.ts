import {
  closeSeasonParamsSchema,
  closeSeasonResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function closeSeason(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/seasons/close',
      {
        schema: {
          tags: ['Temporadas de Trocas'],
          summary: 'Fechar a temporada de trocas ativa na escola',
          security: [{ bearerAuth: [] }],
          params: closeSeasonParamsSchema,
          response: {
            204: closeSeasonResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'ExchangeSeason')) {
          throw new ForbiddenError(
            'Você não tem permissão para fechar a temporada de trocas.',
          )
        }

        const activeSeason = await prisma.exchangeSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'OPEN',
          },
        })

        if (!activeSeason) {
          throw new BadRequestError(
            'Não há nenhuma temporada de trocas ativa nesta escola no momento.',
          )
        }

        await prisma.exchangeSeason.update({
          where: {
            id: activeSeason.id,
          },
          data: {
            status: 'CLOSED',
            closedAt: new Date(),
          },
        })

        return reply.status(204).send()
      },
    )
}
