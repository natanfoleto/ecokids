import { getAwardParamsSchema, getAwardResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getAward(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/awards/:awardId',
      {
        schema: {
          tags: ['Prêmios'],
          summary: 'Buscar um prêmio',
          params: getAwardParamsSchema,
          response: {
            200: getAwardResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, awardId } = request.params

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Award')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar um prêmio.',
          )
        }

        const award = await prisma.award.findFirst({
          where: {
            id: awardId,
          },
        })

        if (!award) {
          throw new BadRequestError(
            'Você não tem permissão para buscar um prêmio.',
          )
        }

        return reply.status(200).send({ award })
      },
    )
}
