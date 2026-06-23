import {
  finishSchoolSeasonBodySchema,
  finishSchoolSeasonParamsSchema,
  finishSchoolSeasonResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function finishSchoolSeason(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/school-seasons/finish',
      {
        schema: {
          tags: ['Temporadas Escolares'],
          summary: 'Encerrar o ciclo de pontuação atual e iniciar o próximo',
          security: [{ bearerAuth: [] }],
          params: finishSchoolSeasonParamsSchema,
          body: finishSchoolSeasonBodySchema,
          response: {
            200: finishSchoolSeasonResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { newSeasonName } = request.body

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'SchoolSeason')) {
          throw new UnauthorizedError(
            'Você não tem permissão para gerenciar ciclos de pontuação.',
          )
        }

        // Execute closure and new season creation atomically inside a transaction
        await prisma.$transaction(async (tx) => {
          // Find the active season
          const activeSeason = await tx.schoolSeason.findFirst({
            where: {
              schoolId: school.id,
              status: 'ACTIVE',
            },
          })

          if (!activeSeason) {
            throw new BadRequestError(
              'Não existe nenhum ciclo de pontuação ativo para encerrar.',
            )
          }

          // Finish the current season
          await tx.schoolSeason.update({
            where: { id: activeSeason.id },
            data: {
              status: 'FINISHED',
              endedAt: new Date(),
            },
          })

          // Create the new season
          await tx.schoolSeason.create({
            data: {
              name: newSeasonName,
              status: 'ACTIVE',
              schoolId: school.id,
            },
          })
        })

        return reply.status(200).send({
          success: true,
        })
      },
    )
}
