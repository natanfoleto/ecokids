import {
  createSchoolSeasonBodySchema,
  createSchoolSeasonParamsSchema,
  createSchoolSeasonResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createSchoolSeason(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/school-seasons',
      {
        schema: {
          tags: ['Temporadas Escolares'],
          summary: 'Iniciar o primeiro ciclo de pontuação',
          security: [{ bearerAuth: [] }],
          params: createSchoolSeasonParamsSchema,
          body: createSchoolSeasonBodySchema,
          response: {
            201: createSchoolSeasonResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const { name } = request.body

        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)
        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'SchoolSeason')) {
          throw new UnauthorizedError(
            'Você não tem permissão para gerenciar ciclos de pontuação.',
          )
        }

        // Check if an active season already exists
        const activeSeason = await prisma.schoolSeason.findFirst({
          where: {
            schoolId: school.id,
            status: 'ACTIVE',
          },
        })

        if (activeSeason) {
          throw new BadRequestError(
            'Já existe um ciclo de pontuação ativo nesta escola.',
          )
        }

        const season = await prisma.schoolSeason.create({
          data: {
            name,
            status: 'ACTIVE',
            schoolId: school.id,
          },
        })

        return reply.status(201).send({
          seasonId: season.id,
        })
      },
    )
}
