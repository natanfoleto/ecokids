import {
  createStudentBodySchema,
  createStudentParamsSchema,
  createStudentResponseSchema,
} from '@ecokids/types'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createStudent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/schools/:schoolSlug/classes/:classId/students',
    {
      schema: {
        tags: ['Estudantes'],
        summary: 'Criar um estudante',
        params: createStudentParamsSchema,
        body: createStudentBodySchema,
        response: {
          201: createStudentResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { schoolSlug, classId } = request.params
      const { code, name, email, cpf, password } = request.body

      const userId = await request.getCurrentUserId()

      const { school, membership } = await request.getUserMembership(schoolSlug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('create', 'Student')) {
        throw new UnauthorizedError(
          'Você não tem permissão para criar novos estudantes.',
        )
      }

      if (email) {
        const studentWithSameEmail = await prisma.student.findUnique({
          where: { email },
        })

        if (studentWithSameEmail) {
          throw new BadRequestError('Um usuário com esse e-mail já existe.')
        }
      }

      if (cpf) {
        const studentWithSameCpf = await prisma.student.findUnique({
          where: { cpf },
        })

        if (studentWithSameCpf) {
          throw new BadRequestError('Um usuário com esse CPF já existe.')
        }
      }

      let newCode

      if (code) {
        const studentWithSameCode = await prisma.student.findFirst({
          where: {
            schoolId: school.id,
            code,
          },
        })

        if (studentWithSameCode) {
          throw new BadRequestError('Um usuário com esse código já existe.')
        }

        newCode = code
      } else {
        const lastStudentCode = await prisma.schoolSettings.findFirst({
          where: {
            schoolId: school.id,
          },
        })

        newCode = (lastStudentCode?.lastStudentCode || 0) + 1
      }

      const passwordHash = await hash(password, 6)

      const { id } = await prisma.student.create({
        data: {
          code: newCode,
          name,
          email,
          cpf,
          passwordHash,
          schoolId: school.id,
          classId,
        },
      })

      return reply.status(201).send({ studentId: id })
    },
  )
}
