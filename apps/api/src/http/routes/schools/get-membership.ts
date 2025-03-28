import {
  getMembershipParamsSchema,
  getMembershipResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/membership',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Buscar associação do membro na escola',
          security: [{ bearerAuth: [] }],
          params: getMembershipParamsSchema,
          response: {
            200: getMembershipResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const {
          membership: { id, role, userId, schoolId },
        } = await request.getUserMembership(schoolSlug)

        return reply.send({
          membership: {
            id,
            role,
            userId,
            schoolId,
          },
        })
      },
    )
}
