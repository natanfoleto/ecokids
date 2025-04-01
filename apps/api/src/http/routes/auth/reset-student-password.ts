import {
  resetStudentPasswordBodySchema,
  resetStudentPasswordResponseSchema,
} from '@ecokids/types'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'

export async function resetStudentPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/students/reset',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Trocar de senha',
        body: resetStudentPasswordBodySchema,
        response: {
          204: resetStudentPasswordResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body

      const tokenFromCode = await prisma.userToken.findUnique({
        where: { id: code },
      })

      if (!tokenFromCode) {
        throw new UnauthorizedError('Código de recuperação de senha inválido.')
      }

      const passwordHash = await hash(password, 6)

      await prisma.$transaction([
        prisma.user.update({
          where: { id: tokenFromCode.userId },
          data: {
            passwordHash,
          },
        }),

        prisma.userToken.delete({
          where: { id: code },
        }),
      ])

      return reply.status(204).send()
    },
  )
}
