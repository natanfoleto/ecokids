import {
  createSeasonBodySchema,
  createSeasonParamsSchema,
  createSeasonResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createSeason(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/seasons',
      {
        schema: {
          tags: ['Temporadas de Trocas'],
          summary: 'Abrir uma nova temporada de trocas na escola',
          security: [{ bearerAuth: [] }],
          params: createSeasonParamsSchema,
          body: createSeasonBodySchema,
          response: {
            201: createSeasonResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { title, description } = request.body

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'ExchangeSeason')) {
          throw new ForbiddenError(
            'Você não tem permissão para abrir uma temporada de trocas.',
          )
        }

        const activeSeason = await prisma.exchangeSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'OPEN',
          },
        })

        if (activeSeason) {
          throw new BadRequestError(
            'Já existe uma temporada de trocas ativa nesta escola.',
          )
        }

        const season = await prisma.exchangeSeason.create({
          data: {
            title,
            description,
            schoolId: school.id,
            status: 'OPEN',
          },
        })

        return reply.status(201).send({ seasonId: season.id })
      },
    )
}
