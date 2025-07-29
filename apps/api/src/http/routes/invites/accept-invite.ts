import {
  acceptInviteParamsSchema,
  acceptInviteResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Aceitar um convite',
          security: [{ bearerAuth: [] }],
          params: acceptInviteParamsSchema,
          response: {
            204: acceptInviteResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentEntityId()

        const { inviteId } = request.params

        const invite = await prisma.invite.findUnique({
          where: { id: inviteId },
        })

        if (!invite) {
          throw new BadRequestError('Convite não encontrado ou foi expirado.')
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!user) {
          throw new BadRequestError('Usuário não existe.')
        }

        if (invite.email !== user?.email) {
          throw new BadRequestError('Esse convite pertence a outro usuário.')
        }

        await prisma.$transaction([
          prisma.member.create({
            data: {
              userId,
              role: invite.role,
              schoolId: invite.schoolId,
            },
          }),

          prisma.invite.delete({
            where: { id: invite.id },
          }),
        ])

        return reply.status(204).send()
      },
    )
}
