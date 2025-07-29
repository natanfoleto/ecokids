import {
  createInviteBodySchema,
  createInviteParamsSchema,
  createInviteResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools/:schoolSlug/invites',
      {
        schema: {
          tags: ['Convites'],
          summary: 'Criar um convite',
          security: [{ bearerAuth: [] }],
          params: createInviteParamsSchema,
          body: createInviteBodySchema,
          response: {
            201: createInviteResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params

        const userId = await request.getCurrentEntityId()

        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar novos convites.',
          )
        }

        const { email, role } = request.body

        const [, domain] = email.split('@')

        if (school.shouldAttachUsersByDomain && domain === school.domain) {
          throw new BadRequestError(
            `Usuários com o domínio ${domain} entrarão nessa escola automaticamente no login.`,
          )
        }

        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_schoolId: {
              email,
              schoolId: school.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'Já existe um convite com o email informado.',
          )
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            schoolId: school.id,
            user: {
              email,
            },
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError(
            'Já existe um membro com o email informado.',
          )
        }

        const { id } = await prisma.invite.create({
          data: {
            schoolId: school.id,
            email,
            role,
            authorId: userId,
          },
        })

        return reply.status(201).send({ inviteId: id })
      },
    )
}
