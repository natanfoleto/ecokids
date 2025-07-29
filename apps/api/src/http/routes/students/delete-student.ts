import {
  deleteStudentParamsSchema,
  deleteStudentResponseSchema,
} from '@ecokids/types/'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function deleteStudent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/schools/:schoolSlug/students/:studentId',
      {
        schema: {
          tags: ['Estudantes'],
          summary: 'Remover um estudante de uma escola',
          security: [{ bearerAuth: [] }],
          params: deleteStudentParamsSchema,
          response: {
            204: deleteStudentResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, studentId } = request.params

        const userId = await request.getCurrentEntityId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Student')) {
          throw new UnauthorizedError(
            'Você não tem permissão para remover um membro dessa escola.',
          )
        }

        await prisma.student.delete({
          where: {
            id: studentId,
            schoolId: school.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
