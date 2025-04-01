import {
  updateStudentBodySchema,
  updateStudentParamsSchema,
} from '@ecokids/types'
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
        },
      },
      async (request, reply) => {
        const { schoolSlug, studentId } = request.params
        const { code, name, email, cpf, classId } = request.body

        const userId = await request.getCurrentUserId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

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

        let newCode

        if (code && code !== studentById.code) {
          const studentWithSameCode = await prisma.student.findFirst({
            where: {
              schoolId: school.id,
              code,
            },
          })

          if (studentWithSameCode && studentWithSameCode.code !== code) {
            throw new BadRequestError('Um usuário com esse código já existe.')
          }

          newCode = code
        } else {
          newCode = studentById.code
        }

        await prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            code: newCode,
            name,
            email,
            cpf,
            classId,
          },
        })

        return reply.status(204).send()
      },
    )
}
