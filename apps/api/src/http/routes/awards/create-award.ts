import {
  createAwardBodySchema,
  createAwardParamsSchema,
  createAwardResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createAward(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/awards',
      {
        schema: {
          tags: ['Prêmios'],
          summary: 'Criar prêmio para uma escola',
          security: [{ bearerAuth: [] }],
          params: createAwardParamsSchema,
          body: createAwardBodySchema,
          response: {
            201: createAwardResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { name, description, value } = request.body

        const userId = await request.getCurrentUserId()

        const { membership, school } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Award')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar prêmios para uma escola.',
          )
        }

        const { id } = await prisma.award.create({
          data: {
            name,
            description,
            value,
            schoolId: school.id,
          },
        })

        return reply.status(201).send({ awardId: id })
      },
    )
}
