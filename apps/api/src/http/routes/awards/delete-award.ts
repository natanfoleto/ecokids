import {
  deleteAwardParamsSchema,
  deleteAwardResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteAward(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/schools/:schoolSlug/awards/:awardId',
      {
        schema: {
          tags: ['Prêmios'],
          summary: 'Deletar um prêmio',
          params: deleteAwardParamsSchema,
          response: {
            204: deleteAwardResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, awardId } = request.params

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Award')) {
          throw new UnauthorizedError(
            'Você não tem permissão para deletar um prêmio.',
          )
        }

        await prisma.award.delete({
          where: {
            id: awardId,
          },
        })

        return reply.status(204).send()
      },
    )
}
