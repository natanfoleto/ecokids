import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentEntityId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch (err) {
        console.log(err)
        throw new UnauthorizedError('Token de autenticação inválido.')
      }
    }

    request.getUserMembership = async (schoolSlug: string) => {
      const userId = await request.getCurrentEntityId()

      const member = await prisma.member.findFirst({
        where: {
          userId,
          school: {
            slug: schoolSlug,
          },
        },
        include: {
          school: true,
        },
      })

      if (!member) {
        throw new UnauthorizedError(`Você não é um membro dessa escola.`)
      }

      const { school, ...membership } = member

      return {
        school,
        membership,
      }
    }
  })
})
