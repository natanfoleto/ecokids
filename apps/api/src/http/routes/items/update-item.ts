import {
  updateItemBodySchema,
  updateItemParamsSchema,
  updateItemResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateItem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/schools/:schoolSlug/items/:itemId',
      {
        schema: {
          tags: ['Itens'],
          summary: 'Atualizar um item',
          params: updateItemParamsSchema,
          body: updateItemBodySchema,
          response: {
            204: updateItemResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, itemId } = request.params
        const { name, description, value } = request.body

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Item')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar um item.',
          )
        }

        await prisma.item.update({
          where: {
            id: itemId,
          },
          data: {
            name,
            description,
            value,
          },
        })

        return reply.status(204).send()
      },
    )
}
