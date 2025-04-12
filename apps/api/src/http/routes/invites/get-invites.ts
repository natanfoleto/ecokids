import {
  getInvitesParamsSchema,
  getInvitesResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/invites',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Listar convites',
          security: [{ bearerAuth: [] }],
          params: getInvitesParamsSchema,
          response: {
            200: getInvitesResponseSchema,
          },
        },
      },
      async (request) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentUserId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'Invite')) {
          throw new UnauthorizedError(
            'Você não tem permissão para listar convites.',
          )
        }

        const invites = await prisma.invite.findMany({
          where: {
            schoolId: school.id,
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
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        })

        return { invites }
      },
    )
}
