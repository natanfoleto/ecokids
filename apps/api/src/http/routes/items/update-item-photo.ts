import {
  updateItemPhotoParamsSchema,
  updateItemPhotoResponseSchema,
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

export async function updateItemPhoto(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(fastifyMultipart)
    .patch(
      '/schools/:schoolSlug/items/:itemId/photo',
      {
        schema: {
          tags: ['Itens'],
          summary: 'Atualizar foto do item',
          params: updateItemPhotoParamsSchema,
          response: {
            204: updateItemPhotoResponseSchema,
          },
        },
      },
      async function (request, reply) {
        const { schoolSlug, itemId } = request.params

        const userId = await request.getCurrentUserId()

        const { membership } = await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', 'Item')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar a foto desse item.',
          )
        }

        const item = await prisma.item.findUnique({
          where: {
            id: itemId,
          },
        })

        if (!item) throw new BadRequestError('Nenhum item encontrado.')

        const data = await request.file()

        if (data && data.filename) {
          const buffer = await data.toBuffer()

          if (!buffer)
            throw new BadRequestError(
              'O arquivo enviado não tem um formato válido.',
            )

          const extension = data.filename.split('.')[1]
          const objectName = `schools/${schoolSlug}/items/${itemId}/photo.${extension}`

          await app.s3Client.uploadFile(
            process.env.R2_BUCKET_NAME,
            objectName,
            buffer,
            data.mimetype,
          )

          const url = getS3PathURL({ objectName })

          await prisma.item.update({
            where: {
              id: item.id,
            },
            data: {
              photoUrl: url,
            },
          })
        } else {
          if (item.photoUrl) {
            const objectName = getS3ObjectName(item.photoUrl)

            await app.s3Client.deleteFile(
              process.env.R2_BUCKET_NAME,
              objectName,
            )
          }

          await prisma.item.update({
            where: {
              id: item.id,
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
