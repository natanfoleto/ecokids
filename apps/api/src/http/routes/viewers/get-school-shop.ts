import {
  getSchoolShopParamsSchema,
  getSchoolShopResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getSchoolShop(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolId/shop',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Buscar os itens da loja de uma escola',
          params: getSchoolShopParamsSchema,
          response: {
            200: getSchoolShopResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolId } = request.params

        const itens = await prisma.award.findMany({
          where: {
            schoolId,
          },
          select: {
            id: true,
            name: true,
            description: true,
            value: true,
            photoUrl: true,
          },
        })

        return reply.status(200).send({ itens })
      },
    )
}
