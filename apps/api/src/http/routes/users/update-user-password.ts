import {
  updateUserPasswordBodySchema,
  updateUserPasswordResponseSchema,
} from '@ecokids/types'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'

export async function updateUserPassword(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/users/password',
      {
        schema: {
          tags: ['Usuários'],
          summary: 'Atualizar a senha de um usuário',
          body: updateUserPasswordBodySchema,
          response: {
            204: updateUserPasswordResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { currentPassword, newPassword, confirmPassword } = request.body

        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('Nenhum usuário encontrado.')
        }

        const currentPasswordHash = await hash(currentPassword, 6)

        if (currentPasswordHash !== user.passwordHash) {
          throw new UnauthorizedError('Senha atual incorreta.')
        }

        if (newPassword !== confirmPassword) {
          throw new BadRequestError('As senhas não coincidem.')
        }

        const passwordHash = await hash(newPassword, 6)

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            passwordHash,
          },
        })

        return reply.status(204).send()
      },
    )
}
