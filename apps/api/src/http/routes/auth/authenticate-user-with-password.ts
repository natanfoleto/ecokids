import {
  authenticateUserWithPasswordBodySchema,
  authenticateUserWithPasswordResponseSchema,
} from '@ecokids/types'
import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { recordAuditLog } from '@/lib/audit-service'
import { prisma } from '@/lib/prisma'

export async function authenticateUserWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate/users/password',
    {
      schema: {
        tags: ['Autenticação'],
        summary: 'Autenticar usuário com e-mail e senha',
        body: authenticateUserWithPasswordBodySchema,
        response: {
          201: authenticateUserWithPasswordResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        await recordAuditLog({
          actorType: 'USER',
          entityType: 'User',
          action: 'AUTH_FAILURE',
          description: `Tentativa inválida de login com o e-mail: ${email}`,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'] || null,
        })
        throw new BadRequestError('Credenciais inválidas.')
      }

      if (userFromEmail.passwordHash === null) {
        await recordAuditLog({
          actorType: 'USER',
          entityType: 'User',
          action: 'AUTH_FAILURE',
          description: `Tentativa inválida de login (usuário sem senha cadastrada) com o e-mail: ${email}`,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'] || null,
        })
        throw new BadRequestError('Usuário não contém uma senha.')
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash,
      )

      if (!isPasswordValid) {
        await recordAuditLog({
          actorType: 'USER',
          entityType: 'User',
          action: 'AUTH_FAILURE',
          description: `Tentativa inválida de login com o e-mail: ${email}`,
          ipAddress: request.ip,
          userAgent: request.headers['user-agent'] || null,
        })
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

      const cookieDomain = process.env.COOKIE_DOMAIN || undefined

      reply.setCookie('token', token, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        ...(cookieDomain && { domain: cookieDomain }),
      })

      await recordAuditLog({
        actorId: userFromEmail.id,
        actorType: 'USER',
        entityType: 'User',
        entityId: userFromEmail.id,
        action: 'LOGIN',
        description: `Usuário ${userFromEmail.email} realizou login no Manager.`,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] || null,
      })

      return reply.status(201).send()
    },
  )
}
