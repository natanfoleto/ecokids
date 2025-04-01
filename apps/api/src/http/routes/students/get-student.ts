import {
  getStudentParamsSchema,
  getStudentResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getStudent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/classes/:classId/students/:studentId',
      {
        schema: {
          tags: ['Estudantes'],
          summary: 'Buscar um estudante de uma classe',
          security: [{ bearerAuth: [] }],
          params: getStudentParamsSchema,
          response: {
            200: getStudentResponseSchema,
          },
        },
      },
      async (request, response) => {
        const { schoolSlug, studentId } = request.params

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Student')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar um estudante.',
          )
        }

        const student = await prisma.student.findFirst({
          where: {
            id: studentId,
          },
          select: {
            id: true,
            code: true,
            name: true,
            cpf: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        if (!student) throw new BadRequestError('Nenhum estudante encontrado.')

        return response.send({
          student,
        })
      },
    )
}
