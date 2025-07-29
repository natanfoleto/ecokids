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
        summary: 'Autenticar estudante com e-mail e senha',
        body: authenticateStudentWithPasswordBodySchema,
        response: {
          201: authenticateStudentWithPasswordResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const studentFromEmail = await prisma.student.findUnique({
        where: { email },
      })

      if (!studentFromEmail) {
        throw new BadRequestError('Credenciais inválidas.')
      }

      if (studentFromEmail.passwordHash === null) {
        throw new BadRequestError('Usuário não contém uma senha.')
      }

      const isPasswordValid = await compare(
        password,
        studentFromEmail.passwordHash,
      )

      if (!isPasswordValid) {
        throw new BadRequestError('Credenciais inválidas.')
      }

      const token = await reply.jwtSign(
        {
          sub: studentFromEmail.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      reply.setCookie('token', token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })

      return reply.status(201).send({ token })
    },
  )
}
