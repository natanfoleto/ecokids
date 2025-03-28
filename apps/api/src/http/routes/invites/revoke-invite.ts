import {
  revokeInviteParamsSchema,
  revokeInviteResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/schools/:schoolSlug/invites/:inviteId',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Revogar convite',
          security: [{ bearerAuth: [] }],
          params: revokeInviteParamsSchema,
          response: {
            204: revokeInviteResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, conviteId } = request.params

        const userId = await request.getCurrentUserId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Invite')) {
          throw new UnauthorizedError(
            'Você não tem permissão para revogar covites.',
          )
        }

        const invite = await prisma.invite.findUnique({
          where: {
            id: conviteId,
            schoolId: school.id,
          },
        })

        if (!invite) {
          throw new BadRequestError('Convite não existe.')
        }

        await prisma.invite.delete({
          where: { id: conviteId },
        })

        return reply.status(204).send()
      },
    )
}
