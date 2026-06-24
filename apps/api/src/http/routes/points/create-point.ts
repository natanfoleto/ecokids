import {
  createPointBodySchema,
  createPointParamsSchema,
  createPointResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createPoint(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/students/:studentId/points',
      {
        schema: {
          tags: ['Pontos'],
          summary: 'Criar pontos para um estudante',
          security: [{ bearerAuth: [] }],
          params: createPointParamsSchema,
          body: createPointBodySchema,
          response: {
            201: createPointResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, studentId } = request.params
        const { items } = request.body

        const userId = await request.getCurrentEntityId()
        const { membership } = await request.getUserMembership(schoolSlug)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Point')) {
          throw new ForbiddenError(
            'Você não tem permissão para criar pontos para um estudante.',
          )
        }

        // Find the active school season
        const activeSeason = await prisma.schoolSeason.findFirst({
          where: {
            schoolId: membership.schoolId,
            status: 'ACTIVE',
          },
        })

        if (!activeSeason) {
          throw new BadRequestError(
            'Não existe nenhuma temporada de pontuação ativa nesta escola no momento.',
          )
        }

        const totalPoints = items.reduce(
          (acc, item) => acc + item.value * item.amount,
          0,
        )

        const point = await prisma.point.create({
          data: {
            amount: totalPoints,
            studentId,
            seasonId: activeSeason.id,
            score_items: {
              create: items.map(({ itemId, amount, value }) => ({
                itemId,
                amount,
                value,
              })),
            },
          },
        })

        return reply.status(201).send({
          pointId: point.id,
        })
      },
    )
}
