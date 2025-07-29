import {
  updateMemberBodySchema,
  updateMemberParamsSchema,
  updateMemberResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/schools/:schoolSlug/members/:memberId',
      {
        schema: {
          tags: ['Membros'],
          summary: 'Atualizar um membro',
          security: [{ bearerAuth: [] }],
          params: updateMemberParamsSchema,
          body: updateMemberBodySchema,
          response: {
            204: updateMemberResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug, memberId } = request.params

        const userId = await request.getCurrentEntityId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Member')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar um membro dessa empresa.',
          )
        }

        const { role } = request.body

        await prisma.member.update({
          where: {
            id: memberId,
            schoolId: school.id,
          },
          data: {
            role,
          },
        })

        return reply.status(204).send()
      },
    )
}
