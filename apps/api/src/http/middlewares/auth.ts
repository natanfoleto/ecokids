import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { requestContextStorage } from '@/lib/request-context'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentEntityId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        const store = requestContextStorage.getStore()
        if (store) {
          store.actorId = sub
          if (
            request.url.startsWith('/viewers') ||
            request.url.startsWith('/authenticate/students')
          ) {
            store.actorType = 'STUDENT'
            // Retrieve student's schoolId automatically
            const student = await prisma.student.findUnique({
              where: { id: sub },
              select: { schoolId: true },
            })
            if (student) {
              store.schoolId = student.schoolId
            }
          } else {
            store.actorType = 'USER'
          }
        }

        return sub
      } catch (err) {
        request.log.warn(err)
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

      const store = requestContextStorage.getStore()
      if (store) {
        store.schoolId = school.id
      }

      return {
        school,
        membership,
      }
    }
  })
})
