import {
  requestStudentPasswordRecoverBodySchema,
  requestStudentPasswordRecoverResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'

export async function requestStudentPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/students/recover',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Solicitar alteração de senha',
        body: requestStudentPasswordRecoverBodySchema,
        response: {
          201: requestStudentPasswordRecoverResponseSchema,
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
