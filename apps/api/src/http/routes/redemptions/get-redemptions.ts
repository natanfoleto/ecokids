import {
  getRedemptionsParamsSchema,
  getRedemptionsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getRedemptions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/redemptions',
      {
        schema: {
          tags: ['Resgates de Prêmios'],
          summary: 'Listar todas as solicitações de resgates da escola',
          security: [{ bearerAuth: [] }],
          params: getRedemptionsParamsSchema,
          response: {
            200: getRedemptionsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'RewardRedemption')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar os resgates desta escola.',
          )
        }

        const redemptions = await prisma.rewardRedemption.findMany({
          where: {
            schoolId: school.id,
          },
          include: {
            student: {
              include: {
                class: true,
              },
            },
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
            student: {
              id: redemption.student.id,
              name: redemption.student.name,
              code: redemption.student.code,
              class: {
                name: redemption.student.class.name,
                year: redemption.student.class.year,
              },
            },
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
