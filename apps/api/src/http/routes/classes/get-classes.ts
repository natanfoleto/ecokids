import {
  getClassesParamsSchema,
  getClassesRequestSchema,
  getClassesResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getClasses(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/classes',
      {
        schema: {
          tags: ['Turmas'],
          summary: 'Buscar todas as turmas de uma escola',
          security: [{ bearerAuth: [] }],
          params: getClassesParamsSchema,
          querystring: getClassesRequestSchema.shape.query,
          response: {
            200: getClassesResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { page, limit, search } = request.query

        const userId = await request.getCurrentEntityId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Class')) {
          throw new ForbiddenError(
            'Você não tem permissão para buscar turmas dessa escola.',
          )
        }

        const where = {
          schoolId: school.id,
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } as const },
                  { year: { contains: search, mode: 'insensitive' } as const },
                ],
              }
            : {}),
        }

        const totalCount = await prisma.class.count({ where })

        const limitVal = limit ? Number(limit) : totalCount
        const pageVal = page ? Number(page) : 1
        const take = limit ? Number(limit) : undefined
        const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined

        const classes = await prisma.class.findMany({
          where,
          select: {
            id: true,
            name: true,
            year: true,
            createdAt: true,
            updatedAt: true,
          },
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

        return reply.send({ classes, meta })
      },
    )
}
