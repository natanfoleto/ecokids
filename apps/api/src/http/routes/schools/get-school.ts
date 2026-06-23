import { getSchoolParamsSchema, getSchoolResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

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

        // Find active school season
        const activeSchoolSeason = await prisma.schoolSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'ACTIVE',
          },
          select: {
            id: true,
            name: true,
          },
        })

        return reply.send({
          school: { ...school, role: membership.role },
          activeSchoolSeason,
        })
      },
    )
}
