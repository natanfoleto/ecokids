import {
  deleteItemParamsSchema,
  deleteItemResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteItem(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/schools/:schoolSlug/items/:itemId',
      {
        schema: {
          tags: ['Itens'],
          summary: 'Deletar um item',
          params: deleteItemParamsSchema,
          response: {
            204: deleteItemResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, itemId } = request.params

        const userId = await request.getCurrentEntityId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Item')) {
          throw new UnauthorizedError(
            'Você não tem permissão para deletar um item.',
          )
        }

        const { id } = await prisma.item.delete({
          where: {
            id: itemId,
          },
          select: {
            id: true,
          },
        })

        if (id) {
          await app.s3Client.deleteFolder(
            process.env.R2_BUCKET_NAME,
            `schools/${schoolSlug}/items/${itemId}`,
          )
        }

        return reply.status(204).send()
      },
    )
}
