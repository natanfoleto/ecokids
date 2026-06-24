import { getItemsParamsSchema, getItemsRequestSchema, getItemsResponseSchema } from '@ecokids/types'
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
          querystring: getItemsRequestSchema.shape.query,
          response: {
            200: getItemsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { page, limit, search } = request.query

        const userId = await request.getCurrentEntityId()

        const { membership, school } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Item')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar os itens.',
          )
        }

        const where = {
          schoolId: school.id,
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } as const },
                  { description: { contains: search, mode: 'insensitive' } as const },
                ],
              }
            : {}),
        }

        const totalCount = await prisma.item.count({ where })

        const limitVal = limit ? Number(limit) : totalCount
        const pageVal = page ? Number(page) : 1
        const take = limit ? Number(limit) : undefined
        const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined

        const items = await prisma.item.findMany({
          where,
          orderBy: {
            name: 'asc',
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

        return reply.status(200).send({ items, meta })
      },
    )
}
