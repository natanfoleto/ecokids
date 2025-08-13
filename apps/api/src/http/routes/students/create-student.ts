import {
  createStudentBodySchema,
  createStudentParamsSchema,
  createStudentResponseSchema,
} from '@ecokids/types'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createStudent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/students',
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
        const { schoolSlug } = request.params
        const { name, email, cpf, password, classId } = request.body

        const userId = await request.getCurrentEntityId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Student')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar um estudantes.',
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

        const lastStudentCode = await prisma.schoolSettings.findFirst({
          where: {
            schoolId: school.id,
          },
        })

        const code = (lastStudentCode?.lastStudentCode || 0) + 1

        const passwordHash = await hash(password ?? '123456', 6)

        const studentId = await prisma.$transaction(async (prisma) => {
          const { id } = await prisma.student.create({
            data: {
              code,
              name,
              email,
              cpf,
              passwordHash,
              schoolId: school.id,
              classId,
            },
          })

          await prisma.schoolSettings.update({
            where: {
              schoolId: school.id,
            },
            data: {
              lastStudentCode: code,
            },
          })

          return id
        })

        return reply.status(201).send({ studentId })
      },
    )
}
