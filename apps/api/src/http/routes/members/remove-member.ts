import {
  removeMemberParamsSchema,
  removeMemberResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function removeMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/schools/:schoolSlug/members/:memberId',
      {
        schema: {
          tags: ['Membros'],
          summary: 'Remover um membro de uma escola',
          security: [{ bearerAuth: [] }],
          params: removeMemberParamsSchema,
          response: {
            204: removeMemberResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, memberId } = request.params

        const userId = await request.getCurrentUserId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', 'Member')) {
          throw new UnauthorizedError(
            'Você não tem permissão para remover um membro dessa escola.',
          )
        }

        await prisma.member.delete({
          where: {
            id: memberId,
            schoolId: school.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
