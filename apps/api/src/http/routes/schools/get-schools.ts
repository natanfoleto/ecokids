import { getSchoolsResponseSchema } from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getSchools(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Buscar todas escolas de um usuário',
          security: [{ bearerAuth: [] }],
          response: {
            200: getSchoolsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const schoolWithUserRole = await prisma.school.findMany({
          where: { members: { some: { userId } } },
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            state: true,
            logoUrl: true,
            createdAt: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
        })

        const schoolsWithUserRole = schoolWithUserRole.map(
          ({ members, ...school }) => {
            return { ...school, role: members[0].role }
          },
        )

        return reply.send({ schools: schoolsWithUserRole })
      },
    )
}
