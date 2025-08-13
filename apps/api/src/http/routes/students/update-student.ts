import {
  updateStudentBodySchema,
  updateStudentParamsSchema,
  updateStudentResponseSchema,
} from '@ecokids/types'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateStudent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/schools/:schoolSlug/students/:studentId',
      {
        schema: {
          tags: ['Estudantes'],
          summary: 'Atualiza um estudante',
          params: updateStudentParamsSchema,
          body: updateStudentBodySchema,
          response: {
            204: updateStudentResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, studentId } = request.params
        const { name, email, cpf, password, classId } = request.body

        const userId = await request.getCurrentEntityId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Student')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar um estudante.',
          )
        }

        const studentById = await prisma.student.findUnique({
          where: {
            id: studentId,
          },
        })

        if (!studentById) {
          throw new BadRequestError('Nenhum usuário encontrado.')
        }

        if (email) {
          const studentWithSameEmail = await prisma.student.findUnique({
            where: { email },
          })

          if (studentWithSameEmail && studentWithSameEmail.email !== email) {
            throw new BadRequestError('Um usuário com esse e-mail já existe.')
          }
        }

        if (cpf) {
          const studentWithSameCpf = await prisma.student.findUnique({
            where: { cpf },
          })

          if (studentWithSameCpf && studentWithSameCpf.cpf !== cpf) {
            throw new BadRequestError('Um usuário com esse CPF já existe.')
          }
        }

        await prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            name,
            email,
            cpf,
            ...(password && { passwordHash: await hash(password, 6) }),
            classId,
          },
        })

        return reply.status(204).send()
      },
    )
}
