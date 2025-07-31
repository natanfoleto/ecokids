import { getStudentProfileResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getStudentProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/students/profile',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Buscar perfil do estudante autenticado',
          security: [{ bearerAuth: [] }],
          response: {
            200: getStudentProfileResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const studentId = await request.getCurrentEntityId()

        const student = await prisma.student.findUnique({
          select: {
            id: true,
            code: true,
            name: true,
            cpf: true,
            email: true,
            school: {
              select: {
                id: true,
                name: true,
              },
            },
            class: {
              select: {
                id: true,
                name: true,
                year: true,
              },
            },
            points: {
              select: {
                amount: true,
              },
            },
          },
          where: {
            id: studentId,
          },
        })

        if (!student) {
          throw new BadRequestError('Estudante não encontrado.')
        }

        const totalPoints = await prisma.point
          .aggregate({
            where: {
              studentId,
            },
            _sum: {
              amount: true,
            },
          })
          .then((data) => data._sum.amount ?? 0)

        const studentsWithPointsAdded = {
          ...student,
          totalPoints,
        }

        return reply.send({ student: studentsWithPointsAdded })
      },
    )
}
