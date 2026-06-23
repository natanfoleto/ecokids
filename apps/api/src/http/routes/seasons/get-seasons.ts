import {
  getSeasonsParamsSchema,
  getSeasonsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getSeasons(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/seasons',
      {
        schema: {
          tags: ['Temporadas de Trocas'],
          summary: 'Listar o histórico de temporadas de trocas da escola',
          security: [{ bearerAuth: [] }],
          params: getSeasonsParamsSchema,
          response: {
            200: getSeasonsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const { school } = await request.getUserMembership(schoolSlug)

        const seasons = await prisma.exchangeSeason.findMany({
          where: {
            schoolId: school.id,
          },
          orderBy: {
            openedAt: 'desc',
          },
        })

        return reply.send({ seasons })
      },
    )
}
