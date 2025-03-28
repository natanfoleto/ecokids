import { getInviteParamsSchema, getInviteResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/invites/:inviteId',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Listar detalhes do convite',
          security: [{ bearerAuth: [] }],
          params: getInviteParamsSchema,
          response: {
            200: getInviteResponseSchema,
          },
        },
      },
      async (request) => {
        const { inviteId } = request.params

        const invite = await prisma.invite.findUnique({
          where: {
            id: inviteId,
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            school: {
              select: {
                name: true,
              },
            },
          },
        })

        if (!invite) {
          throw new BadRequestError('Convite não encontrado.')
        }

        return { invite }
      },
    )
}
