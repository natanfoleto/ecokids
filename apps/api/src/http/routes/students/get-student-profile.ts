import { getStudentProfileResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getStudentProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/profile/students',
      {
        schema: {
          tags: ['Estudantes'],
          summary: 'Buscar perfil do estudante autenticado',
          security: [{ bearerAuth: [] }],
          response: {
            200: getStudentProfileResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
          },
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('Estudante não encontrado.')
        }

        return reply.send({ user })
      },
    )
}
