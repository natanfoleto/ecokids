import {
  updateStudentPasswordBodySchema,
  updateStudentPasswordResponseSchema,
} from '@ecokids/types'
import { compare, hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function updateStudentPassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/viewers/students/password',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Atualizar a senha do estudante autenticado',
          security: [{ bearerAuth: [] }],
          body: updateStudentPasswordBodySchema,
          response: {
            204: updateStudentPasswordResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { currentPassword, newPassword } = request.body

        const studentId = await request.getCurrentEntityId()

        const student = await prisma.student.findUnique({
          where: {
            id: studentId,
          },
        })

        if (!student) {
          throw new BadRequestError('Estudante não encontrado.')
        }

        const isPasswordValid = await compare(
          currentPassword,
          student.passwordHash,
        )

        if (!isPasswordValid) {
          throw new BadRequestError('Senha atual incorreta.')
        }

        const isNewPasswordSame = await compare(
          newPassword,
          student.passwordHash,
        )

        if (isNewPasswordSame) {
          throw new BadRequestError(
            'A nova senha deve ser diferente da senha atual.',
          )
        }

        const passwordHash = await hash(newPassword, 6)

        await prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            passwordHash,
          },
        })

        return reply.status(204).send()
      },
    )
}
