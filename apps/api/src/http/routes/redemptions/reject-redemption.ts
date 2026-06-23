import {
  rejectRedemptionBodySchema,
  rejectRedemptionParamsSchema,
  rejectRedemptionResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function rejectRedemption(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/schools/:schoolSlug/redemptions/:redemptionId/reject',
      {
        schema: {
          tags: ['Resgates de Prêmios'],
          summary: 'Rejeitar uma solicitação de resgate',
          security: [{ bearerAuth: [] }],
          params: rejectRedemptionParamsSchema,
          body: rejectRedemptionBodySchema,
          response: {
            204: rejectRedemptionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, redemptionId } = request.params
        const { rejectionReason } = request.body

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'RewardRedemption')) {
          throw new UnauthorizedError(
            'Você não tem permissão para rejeitar resgates nesta escola.',
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

        if (redemption.status !== 'PENDING') {
          throw new BadRequestError(
            'Apenas solicitações pendentes podem ser rejeitadas.',
          )
        }

        await prisma.rewardRedemption.update({
          where: {
            id: redemptionId,
          },
          data: {
            status: 'REJECTED',
            rejectedAt: new Date(),
            rejectionReason,
          },
        })

        return reply.status(204).send()
      },
    )
}
