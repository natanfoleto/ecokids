import { getItemParamsSchema, getItemResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getItem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/items/:itemId',
      {
        schema: {
          tags: ['Itens'],
          summary: 'Buscar um item',
          params: getItemParamsSchema,
          response: {
            200: getItemResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, itemId } = request.params

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Item')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar um item.',
          )
        }

        const item = await prisma.item.findFirst({
          where: {
            id: itemId,
          },
        })

        if (!item) {
          throw new BadRequestError('Nenhum item encontrado.')
        }

        return reply.status(200).send({ item })
      },
    )
}
