import { schoolSchema } from '@ecokids/auth'
import {
  updateSchoolBodySchema,
  updateSchoolParamsSchema,
  updateSchoolResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateSchool(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/schools/:schoolSlug',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Atualizar uma escola',
          security: [{ bearerAuth: [] }],
          body: updateSchoolBodySchema,
          params: updateSchoolParamsSchema,
          response: {
            204: updateSchoolResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { name, domain, shouldAttachUsersByDomain } = request.body

        const userId = await request.getCurrentUserId()

        const { membership, school } =
          await request.getUserMembership(schoolSlug)

        const authSchool = schoolSchema.parse(school)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authSchool)) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar esta escola.',
          )
        }

        if (domain) {
          const schoolByDomain = await prisma.school.findFirst({
            where: {
              domain,
              id: { not: school.id },
            },
          })

          if (schoolByDomain) {
            throw new BadRequestError(
              'Outra escola com esse dominio já existe.',
            )
          }
        }

        await prisma.school.update({
          where: {
            id: school.id,
          },
          data: {
            name,
            domain,
            shouldAttachUsersByDomain,
          },
        })

        return reply.status(204).send()
      },
    )
}
