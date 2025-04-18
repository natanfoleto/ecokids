import { updateUserBodySchema, updateUserResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
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
        const { name, cpf } = request.body

        const userId = await request.getCurrentUserId()

        if (cpf) {
          const studentWithSameCpf = await prisma.student.findUnique({
            where: { cpf },
          })

          if (studentWithSameCpf && studentWithSameCpf.cpf !== cpf) {
            throw new BadRequestError('Um usuário com esse CPF já existe.')
          }
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            name,
            cpf,
          },
        })

        return reply.status(204).send()
      },
    )
}
