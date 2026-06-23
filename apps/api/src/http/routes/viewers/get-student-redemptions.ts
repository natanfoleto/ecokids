import { getStudentRedemptionsResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getStudentRedemptions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/viewers/students/redemptions',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Listar o histórico de resgates do estudante autenticado',
          security: [{ bearerAuth: [] }],
          response: {
            200: getStudentRedemptionsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const studentId = await request.getCurrentEntityId()

        const redemptions = await prisma.rewardRedemption.findMany({
          where: {
            studentId,
          },
          include: {
            award: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return reply.send({
          redemptions: redemptions.map((redemption) => ({
            id: redemption.id,
            pointsCost: redemption.pointsCost,
            status: redemption.status,
            createdAt: redemption.createdAt,
            approvedAt: redemption.approvedAt,
            rejectedAt: redemption.rejectedAt,
            deliveredAt: redemption.deliveredAt,
            cancelledAt: redemption.cancelledAt,
            rejectionReason: redemption.rejectionReason,
            pickupInstructions: redemption.pickupInstructions,
            award: {
              id: redemption.award.id,
              name: redemption.award.name,
              value: redemption.award.value,
              photoUrl: redemption.award.photoUrl,
            },
          })),
        })
      },
    )
}
