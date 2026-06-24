import {
  getRedemptionsParamsSchema,
  getRedemptionsRequestSchema,
  getRedemptionsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
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
          querystring: getRedemptionsRequestSchema.shape.query,
          response: {
            200: getRedemptionsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { page, limit, search, status } = request.query

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'RewardRedemption')) {
          throw new ForbiddenError(
            'Você não tem permissão para visualizar os resgates desta escola.',
          )
        }

        const statuses = status ? status.split(',') : undefined

        const where = {
          schoolId: school.id,
          ...(statuses
            ? {
                status: { in: statuses as any },
              }
            : {}),
          ...(search
            ? {
                OR: [
                  {
                    student: {
                      name: { contains: search, mode: 'insensitive' } as const,
                    },
                  },
                  {
                    award: {
                      name: { contains: search, mode: 'insensitive' } as const,
                    },
                  },
                ],
              }
            : {}),
        }

        const totalCount = await prisma.rewardRedemption.count({ where })

        const limitVal = limit ? Number(limit) : totalCount
        const pageVal = page ? Number(page) : 1
        const take = limit ? Number(limit) : undefined
        const skip =
          page && limit ? (Number(page) - 1) * Number(limit) : undefined

        const redemptions = await prisma.rewardRedemption.findMany({
          where,
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
          take,
          skip,
        })

        const pageCount = limitVal > 0 ? Math.ceil(totalCount / limitVal) : 1

        const meta = {
          page: pageVal,
          limit: limitVal,
          totalCount,
          pageCount,
        }

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
          meta,
        })
      },
    )
}
