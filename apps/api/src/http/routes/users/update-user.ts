import { updateUserBodySchema, updateUserResponseSchema } from '@ecokids/types'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'

export async function updateUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/users',
      {
        schema: {
          tags: ['Usuários'],
          summary: 'Atualizar um usuário',
          body: updateUserBodySchema,
          response: {
            204: updateUserResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { name, cpf, password, oldPassword } = request.body

        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('Nenhum usuário encontrado.')
        }

        if (password) {
          if (!oldPassword) {
            throw new BadRequestError(
              'Para atualizar a senha é necessário enviar a senha antiga.',
            )
          }

          const oldPasswordHash = await hash(oldPassword, 6)

          if (oldPasswordHash !== user.passwordHash) {
            throw new UnauthorizedError('A senha antiga está incorreta.')
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
            id: userId,
          },
          data: {
            name,
            cpf,
            ...(password && { passwordHash: await hash(password, 6) }),
          },
        })

        return reply.status(204).send()
      },
    )
}
