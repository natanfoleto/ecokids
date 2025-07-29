import {
  deleteClassParamsSchema,
  deleteClassResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteClass(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/schools/:schoolSlug/classes/:classId',
      {
        schema: {
          tags: ['Turmas'],
          summary: 'Deletar uma turma',
          security: [{ bearerAuth: [] }],
          params: deleteClassParamsSchema,
          response: {
            204: deleteClassResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, classId } = request.params

        const userId = await request.getCurrentEntityId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Class')) {
          throw new UnauthorizedError(
            'Você não tem permissão para deletar uma turma.',
          )
        }

        await prisma.class.delete({
          where: {
            id: classId,
            schoolId: school.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
