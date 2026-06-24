import {
  approveRedemptionBodySchema,
  approveRedemptionParamsSchema,
  approveRedemptionResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function approveRedemption(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/schools/:schoolSlug/redemptions/:redemptionId/approve',
      {
        schema: {
          tags: ['Resgates de Prêmios'],
          summary: 'Aprovar uma solicitação de resgate',
          security: [{ bearerAuth: [] }],
          params: approveRedemptionParamsSchema,
          body: approveRedemptionBodySchema,
          response: {
            204: approveRedemptionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, redemptionId } = request.params
        const { pickupInstructions } = request.body

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'RewardRedemption')) {
          throw new ForbiddenError(
            'Você não tem permissão para aprovar resgates nesta escola.',
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
            'Apenas solicitações pendentes podem ser aprovadas.',
          )
        }

        await prisma.rewardRedemption.update({
          where: {
            id: redemptionId,
          },
          data: {
            status: 'APPROVED',
            approvedAt: new Date(),
            pickupInstructions,
          },
        })

        return reply.status(204).send()
      },
    )
}
