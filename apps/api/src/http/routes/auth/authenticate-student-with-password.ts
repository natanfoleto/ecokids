import {
  authenticateStudentWithPasswordBodySchema,
  authenticateStudentWithPasswordResponseSchema,
} from '@ecokids/types'
import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function authenticateStudentWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate/students/password',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Autenticar com e-mail e senha',
        body: authenticateStudentWithPasswordBodySchema,
        response: {
          201: authenticateStudentWithPasswordResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        throw new BadRequestError('Credenciais inválidas.')
      }

      if (userFromEmail.passwordHash === null) {
        throw new BadRequestError('Usuário não contém uma senha.')
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash,
      )

      if (!isPasswordValid) {
        throw new BadRequestError('Credenciais inválidas.')
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}
