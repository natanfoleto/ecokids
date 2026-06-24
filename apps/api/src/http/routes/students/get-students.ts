import {
  getStudentsParamsSchema,
  getStudentsRequestSchema,
  getStudentsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
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
          querystring: getStudentsRequestSchema.shape.query,
          response: {
            200: getStudentsResponseSchema,
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

        if (cannot('get', 'Student')) {
          throw new ForbiddenError(
            'Você não tem permissão para buscar os estudantes de uma escola.',
          )
        }

        const where = {
          schoolId: school.id,
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } as const },
                  { email: { contains: search, mode: 'insensitive' } as const },
                  { cpf: { contains: search, mode: 'insensitive' } as const },
                ],
              }
            : {}),
        }

        const totalCount = await prisma.student.count({ where })

        const limitVal = limit ? Number(limit) : totalCount
        const pageVal = page ? Number(page) : 1
        const take = limit ? Number(limit) : undefined
        const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined

        const students = await prisma.student.findMany({
          where,
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
          orderBy: {
            name: 'asc',
          },
          take,
          skip,
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

        const pageCount = limitVal > 0 ? Math.ceil(totalCount / limitVal) : 1

        const meta = {
          page: pageVal,
          limit: limitVal,
          totalCount,
          pageCount,
        }

        return reply.send({
          students: studentsWithPointsAdded,
          meta,
        })
      },
    )
}
