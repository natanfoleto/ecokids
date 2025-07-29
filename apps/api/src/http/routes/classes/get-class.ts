import { getClassParamsSchema, getClassResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getClass(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/classes/:classId',
      {
        schema: {
          tags: ['Turmas'],
          summary: 'Buscar uma turma',
          security: [{ bearerAuth: [] }],
          params: getClassParamsSchema,
          response: {
            200: getClassResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, classId } = request.params

        const userId = await request.getCurrentEntityId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Class')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar uma turma.',
          )
        }

        const classById = await prisma.class.findFirst({
          where: {
            id: classId,
            schoolId: school.id,
          },
          select: {
            id: true,
            name: true,
            year: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        if (!classById) throw new BadRequestError('Nenhuma turma encontrada.')

        return reply.send({
          class: classById,
        })
      },
    )
}
