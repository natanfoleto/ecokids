import {
  getSchoolClassesParamsSchema,
  getSchoolClassesResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getSchoolClasses(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/viewers/schools/:schoolId/classes',
      {
        schema: {
          tags: ['Espectadores'],
          summary: 'Buscar todas as turmas de uma escola',
          security: [{ bearerAuth: [] }],
          params: getSchoolClassesParamsSchema,
          response: {
            200: getSchoolClassesResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolId } = request.params

        const classes = await prisma.class.findMany({
          where: {
            schoolId,
          },
          select: {
            id: true,
            name: true,
            year: true,
          },
        })

        return reply.send({ classes })
      },
    )
}
