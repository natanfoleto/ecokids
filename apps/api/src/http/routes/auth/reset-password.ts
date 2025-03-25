import {
  resetPasswordBodySchema,
  resetPasswordResponseSchema,
} from '@ecokids/types'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Trocar de senha',
        body: resetPasswordBodySchema,
        response: {
          204: resetPasswordResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body

      const tokenFromCode = await prisma.token.findUnique({
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

        prisma.token.delete({
          where: { id: code },
        }),
      ])

      return reply.status(204).send()
    },
  )
}
