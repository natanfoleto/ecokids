import { getAwardsParamsSchema, getAwardsResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getAwards(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/awards',
      {
        schema: {
          tags: ['Prêmios'],
          summary: 'Buscar um prêmio',
          params: getAwardsParamsSchema,
          response: {
            200: getAwardsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentUserId()

        const { membership, school } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Award')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar os prêmios.',
          )
        }

        const awards = await prisma.award.findMany({
          where: {
            schoolId: school.id,
          },
        })

        return reply.status(200).send({ awards })
      },
    )
}
