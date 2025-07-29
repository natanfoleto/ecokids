import { schoolSchema } from '@ecokids/auth'
import {
  updateSchoolLogoParamsSchema,
  updateSchoolLogoResponseSchema,
} from '@ecokids/types'
import fastifyMultipart from '@fastify/multipart'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getS3ObjectName, getS3PathURL } from '@/utils/aws'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function updateSchoolLogo(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(fastifyMultipart)
    .patch(
      '/schools/:schoolSlug/logo',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Atualizar logo da escola',
          params: updateSchoolLogoParamsSchema,
          response: {
            204: updateSchoolLogoResponseSchema,
          },
        },
      },
      async function (request, reply) {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentEntityId()

        const { membership, school } =
          await request.getUserMembership(schoolSlug)

        const authSchool = schoolSchema.parse(school)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authSchool)) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar a logo dessa escola.',
          )
        }

        const data = await request.file()

        if (data && data.filename) {
          const buffer = await data.toBuffer()

          if (!buffer)
            throw new BadRequestError(
              'O arquivo enviado não tem um formato válido.',
            )

          const extension = data.filename.split('.')[1]
          const objectName = `schools/${schoolSlug}/logo.${extension}`

          await app.s3Client.uploadFile(
            process.env.R2_BUCKET_NAME,
            objectName,
            buffer,
            data.mimetype,
          )

          const url = getS3PathURL({ objectName })

          await prisma.school.update({
            where: {
              id: school.id,
            },
            data: {
              logoUrl: url,
            },
          })
        } else {
          if (school.logoUrl) {
            const objectName = getS3ObjectName(school.logoUrl)

            await app.s3Client.deleteFile(
              process.env.R2_BUCKET_NAME,
              objectName,
            )
          }

          await prisma.school.update({
            where: {
              id: school.id,
            },
            data: {
              logoUrl: null,
            },
          })
        }

        return reply.status(204).send()
      },
    )
}
