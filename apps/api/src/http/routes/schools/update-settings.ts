import { schoolSchema } from '@ecokids/auth'
import {
  updateSchoolSettingsBodySchema,
  updateSchoolSettingsParamsSchema,
  updateSchoolSettingsResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateSettings(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/schools/:schoolSlug/settings',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Atualizar as configurações de uma escola',
          security: [{ bearerAuth: [] }],
          body: updateSchoolSettingsBodySchema,
          params: updateSchoolSettingsParamsSchema,
          response: {
            204: updateSchoolSettingsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { nextSeasonMessage } = request.body

        const userId = await request.getCurrentEntityId()

        const { membership, school } =
          await request.getUserMembership(schoolSlug)

        const authSchool = schoolSchema.parse(school)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authSchool)) {
          throw new ForbiddenError(
            'Você não tem permissão para atualizar as configurações desta escola.',
          )
        }

        await prisma.schoolSettings.update({
          where: {
            schoolId: school.id,
          },
          data: {
            nextSeasonMessage,
          },
        })

        return reply.status(204).send()
      },
    )
}
