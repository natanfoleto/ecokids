import { getItemsParamsSchema, getItemsResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getItems(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/items',
      {
        schema: {
          tags: ['Itens'],
          summary: 'Buscar os itens de uma escola',
          params: getItemsParamsSchema,
          response: {
            200: getItemsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentUserId()

        const { membership, school } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Item')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar os itens.',
          )
        }

        const items = await prisma.item.findMany({
          where: {
            schoolId: school.id,
          },
        })

        return reply.status(200).send({ items })
      },
    )
}
