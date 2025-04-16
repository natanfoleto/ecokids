import {
  updateClassBodySchema,
  updateClassParamsSchema,
  updateClassResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateClass(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/schools/:schoolSlug/classes/:classId',
      {
        schema: {
          tags: ['Turmas'],
          summary: 'Atualizar uma turma',
          security: [{ bearerAuth: [] }],
          params: updateClassParamsSchema,
          body: updateClassBodySchema,
          response: {
            204: updateClassResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, classId } = request.params
        const { name, year } = request.body

        const userId = await request.getCurrentUserId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Class')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar uma turma.',
          )
        }

        await prisma.class.update({
          where: {
            id: classId,
            schoolId: school.id,
          },
          data: {
            name,
            year,
          },
        })

        return reply.status(204).send()
      },
    )
}
