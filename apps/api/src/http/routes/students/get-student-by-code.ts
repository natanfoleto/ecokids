import {
  getStudentByCodeParamsSchema,
  getStudentByCodeResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getStudentByCode(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/students/code/:code',
      {
        schema: {
          tags: ['Estudantes'],
          summary: 'Buscar um estudante pelo código',
          security: [{ bearerAuth: [] }],
          params: getStudentByCodeParamsSchema,
          response: {
            200: getStudentByCodeResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, code } = request.params

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Student')) {
          throw new UnauthorizedError(
            'Você não tem permissão para buscar um estudante pelo código.',
          )
        }

        const student = await prisma.student.findFirst({
          where: {
            code: Number(code),
          },
          select: {
            id: true,
            code: true,
            name: true,
            cpf: true,
            email: true,
            classId: true,
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
            _count: {
              select: {
                points: true,
              },
            },
          },
        })

        if (!student) throw new BadRequestError('Nenhum estudante encontrado.')

        return reply.send({
          student,
        })
      },
    )
}
