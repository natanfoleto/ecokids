import { schoolSchema } from '@ecokids/auth'
import {
  shutdownSchoolParamsSchema,
  shutdownSchoolResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { UnauthorizedError } from '@//http/routes/_errors/unauthorized-error'
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function shutdownSchool(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/schools/:schoolSlug',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Encerrar uma escola',
          security: [{ bearerAuth: [] }],
          params: shutdownSchoolParamsSchema,
          response: {
            204: shutdownSchoolResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentEntityId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const authSchool = schoolSchema.parse(school)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authSchool)) {
          throw new UnauthorizedError(
            'Você não tem permissão para encerrar esta escola.',
          )
        }

        const { id } = await prisma.school.delete({
          where: {
            id: school.id,
          },
          select: {
            id: true,
          },
        })

        if (id) {
          await app.s3Client.deleteFolder(
            process.env.R2_BUCKET_NAME,
            `schools/${schoolSlug}`,
          )
        }

        return reply.status(204).send()
      },
    )
}
