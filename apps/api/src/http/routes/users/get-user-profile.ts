import { getUserProfileResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getUserProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/users/profile',
      {
        schema: {
          tags: ['Usuários'],
          summary: 'Buscar perfil do usuário autenticado',
          security: [{ bearerAuth: [] }],
          response: {
            200: getUserProfileResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentEntityId()

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            cpf: true,
            avatarUrl: true,
            createdAt: true,
          },
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('Usuário não encontrado.')
        }

        return reply.send({ user })
      },
    )
}
