import { createUserBodySchema } from '@ecokids/types'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Usuários'],
        summary: 'Criar uma usuário',
        body: createUserBodySchema,
      },
    },
    async (request, reply) => {
      const { name, email, cpf, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('Um usuário com esse e-mail já existe.')
      }

      const [, domain] = email.split('@')

      const autoJoinSchool = await prisma.school.findFirst({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })

      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: {
          name,
          email,
          cpf,
          passwordHash,
          member_on: autoJoinSchool
            ? {
              create: {
                schoolId: autoJoinSchool.id,
              },
            }
            : undefined,
        },
      })

      return reply.status(201).send()
    },
  )
}
