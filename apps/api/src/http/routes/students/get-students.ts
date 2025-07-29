import {
  getStudentsParamsSchema,
  getStudentsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getStudents(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/students',
      {
        schema: {
          tags: ['Estudantes'],
          summary: 'Buscar todos os estudantes de uma escola',
          security: [{ bearerAuth: [] }],
          params: getStudentsParamsSchema,
          response: {
            200: getStudentsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentEntityId()

        const { membership, school } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Student')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar os estudantes de uma escola.',
          )
        }

        const students = await prisma.student.findMany({
          where: {
            schoolId: school.id,
          },
          select: {
            id: true,
            code: true,
            name: true,
            cpf: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            class: {
              select: {
                id: true,
                name: true,
                year: true,
              },
            },
            points: {
              select: {
                id: true,
                amount: true,
                createdAt: true,
              },
            },
          },
        })

        const studentsWithPointsAdded = students.map((student) => {
          const totalPoints = student.points.reduce((sum, point) => {
            return sum + point.amount
          }, 0)

          return {
            ...student,
            totalPoints,
          }
        })

        return reply.send({
          students: studentsWithPointsAdded,
        })
      },
    )
}
