import {
  updateAwardPhotoParamsSchema,
  updateAwardPhotoResponseSchema,
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

export async function updateAwardPhoto(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(fastifyMultipart)
    .patch(
      '/schools/:schoolSlug/awards/:awardId/photo',
      {
        schema: {
          tags: ['Prêmios'],
          summary: 'Atualizar foto do prêmio',
          params: updateAwardPhotoParamsSchema,
          response: {
            204: updateAwardPhotoResponseSchema,
          },
        },
      },
      async function (request, reply) {
        const { schoolSlug, awardId } = request.params

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Award')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar a foto desse prêmio.',
          )
        }

        const award = await prisma.award.findUnique({
          where: {
            id: awardId,
          },
        })

        if (!award) throw new BadRequestError('Prêmio não encontrado.')

        const data = await request.file()

        if (data && data.filename) {
          const buffer = await data.toBuffer()

          if (!buffer)
            throw new BadRequestError(
              'O arquivo enviado não tem um formato válido.',
            )

          const extension = data.filename.split('.')[1]
          const objectName = `schools/${schoolSlug}/awards/${awardId}/photo.${extension}`

          await app.s3Client.uploadFile(
            process.env.R2_BUCKET_NAME,
            objectName,
            buffer,
            data.mimetype,
          )

          const url = getS3PathURL({ objectName })

          await prisma.award.update({
            where: {
              id: award.id,
            },
            data: {
              photoUrl: url,
            },
          })
        } else {
          if (award.photoUrl) {
            const objectName = getS3ObjectName(award.photoUrl)

            await app.s3Client.deleteFile(
              process.env.R2_BUCKET_NAME,
              objectName,
            )
          }

          await prisma.award.update({
            where: {
              id: award.id,
            },
            data: {
              photoUrl: null,
            },
          })
        }

        return reply.status(204).send()
      },
    )
}
