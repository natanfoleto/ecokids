import {
  rejectInviteParamsSchema,
  rejectInviteResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function rejectInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/invites/:inviteId/reject',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Rejeitar convite',
          security: [{ bearerAuth: [] }],
          params: rejectInviteParamsSchema,
          response: {
            204: rejectInviteResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params

        const userId = await request.getCurrentUserId()

        const invite = await prisma.invite.findUnique({
          where: { id: inviteId },
        })

        if (!invite) {
          throw new BadRequestError('Convite não encontrado ou expirado.')
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          throw new BadRequestError('Usuário não encontrado.')
        }

        if (invite.email !== user.email) {
          throw new BadRequestError('Esse convite pertence a outro usuário.')
        }

        await prisma.invite.delete({
          where: { id: inviteId },
        })

        return reply.status(204).send()
      },
    )
}
