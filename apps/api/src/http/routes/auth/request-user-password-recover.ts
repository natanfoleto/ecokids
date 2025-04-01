import {
  requestUserPasswordRecoverBodySchema,
  requestUserPasswordRecoverResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'

export async function requestUserPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/users/recover',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Solicitar alteração de senha',
        body: requestUserPasswordRecoverBodySchema,
        response: {
          201: requestUserPasswordRecoverResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        // Não queremos que as pessoas saibam se o usuário realmente existe
        return reply.status(201).send()
      }

      const { id: code } = await prisma.userToken.create({
        data: {
          type: 'PASSWORD_RECOVER',
          userId: userFromEmail.id,
        },
      })

      // Send e-mail with password link

      console.log('Token de recuperação de senha:', code)

      return reply.status(201).send()
    },
  )
}
