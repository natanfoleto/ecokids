import {
  updateAwardBodySchema,
  updateAwardParamsSchema,
  updateAwardResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateAward(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/schools/:schoolSlug/awards/:awardId',
      {
        schema: {
          tags: ['Prêmios'],
          summary: 'Atualizar um prêmio',
          params: updateAwardParamsSchema,
          body: updateAwardBodySchema,
          response: {
            204: updateAwardResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, awardId } = request.params
        const { name, description, value } = request.body

        const userId = await request.getCurrentEntityId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Award')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar um prêmio.',
          )
        }

        await prisma.award.update({
          where: {
            id: awardId,
          },
          data: {
            name,
            description,
            value,
          },
        })

        return reply.status(204).send()
      },
    )
}
