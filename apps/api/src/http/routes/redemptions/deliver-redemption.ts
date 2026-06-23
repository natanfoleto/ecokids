import {
  deliverRedemptionParamsSchema,
  deliverRedemptionResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deliverRedemption(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/schools/:schoolSlug/redemptions/:redemptionId/deliver',
      {
        schema: {
          tags: ['Resgates de Prêmios'],
          summary: 'Marcar uma solicitação de resgate como entregue',
          security: [{ bearerAuth: [] }],
          params: deliverRedemptionParamsSchema,
          response: {
            204: deliverRedemptionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, redemptionId } = request.params

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'RewardRedemption')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar resgates nesta escola.',
          )
        }

        const redemption = await prisma.rewardRedemption.findUnique({
          where: {
            id: redemptionId,
            schoolId: school.id,
          },
        })

        if (!redemption) {
          throw new BadRequestError('Solicitação de resgate não encontrada.')
        }

        if (redemption.status !== 'APPROVED') {
          throw new BadRequestError(
            'Apenas solicitações aprovadas podem ser marcadas como entregues.',
          )
        }

        await prisma.rewardRedemption.update({
          where: {
            id: redemptionId,
          },
          data: {
            status: 'DELIVERED',
            deliveredAt: new Date(),
          },
        })

        return reply.status(204).send()
      },
    )
}
