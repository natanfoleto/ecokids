import { updateUserAvatarResponseSchema } from '@ecokids/types'
import fastifyMultipart from '@fastify/multipart'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { getS3ObjectName, getS3PathURL } from '@/utils/aws'

export async function updateUserAvatar(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .register(fastifyMultipart)
    .patch(
      '/users/avatar',
      {
        schema: {
          tags: ['Usuários'],
          summary: 'Atualizar avatar do usuário',
          response: {
            204: updateUserAvatarResponseSchema,
          },
        },
      },
      async function (request, reply) {
        const userId = await request.getCurrentUserId()

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        if (!user) {
          throw new BadRequestError('Nenhum usuário encontrado.')
        }

        const data = await request.file()

        if (data && data.filename) {
          const buffer = await data.toBuffer()

          if (!buffer)
            throw new BadRequestError(
              'O arquivo enviado não tem um formato válido.',
            )

          const extension = data.filename.split('.')[1]
          const objectName = `users/${userId}/avatar.${extension}`

          await app.s3Client.uploadFile(
            process.env.R2_BUCKET_NAME,
            objectName,
            buffer,
            data.mimetype,
          )

          const url = getS3PathURL({ objectName })

          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              avatarUrl: url,
            },
          })
        } else {
          if (user.avatarUrl) {
            const objectName = getS3ObjectName(user.avatarUrl)

            await app.s3Client.deleteFile(
              process.env.R2_BUCKET_NAME,
              objectName,
            )
          }

          await prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              avatarUrl: null,
            },
          })
        }

        return reply.status(204).send()
      },
    )
}
