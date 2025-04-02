import { getSchoolParamsSchema, getSchoolResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'

export async function getSchool(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Buscar uma escola',
          security: [{ bearerAuth: [] }],
          params: getSchoolParamsSchema,
          response: {
            200: getSchoolResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        return reply.send({
          school: { ...school, role: membership.role },
        })
      },
    )
}
