import {
  cancelRedemptionParamsSchema,
  cancelRedemptionResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function cancelRedemption(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/viewers/redemptions/:redemptionId/cancel',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Cancelar uma solicitação de resgate pendente',
          security: [{ bearerAuth: [] }],
          params: cancelRedemptionParamsSchema,
          response: {
            204: cancelRedemptionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const studentId = await request.getCurrentEntityId()
        const { redemptionId } = request.params

        const redemption = await prisma.rewardRedemption.findUnique({
          where: {
            id: redemptionId,
          },
        })

        if (!redemption || redemption.studentId !== studentId) {
          throw new BadRequestError('Solicitação de resgate não encontrada.')
        }

        if (redemption.status !== 'PENDING') {
          throw new BadRequestError(
            'Apenas solicitações pendentes podem ser canceladas.',
          )
        }

        await prisma.rewardRedemption.update({
          where: {
            id: redemptionId,
          },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
          },
        })

        return reply.status(204).send()
      },
    )
}
