import {
  createSchoolBodySchema,
  createSchoolResponseSchema,
} from '@ecokids/types'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { generateRandomHash } from '@/utils/generate-random-hash'

export async function createSchool(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/schools',
      {
        schema: {
          tags: ['Escolas'],
          summary: 'Criar uma escola',
          security: [{ bearerAuth: [] }],
          body: createSchoolBodySchema,
          response: {
            201: createSchoolResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { name, domain, shouldAttachUsersByDomain } = request.body

        const userId = await request.getCurrentUserId()

        let schoolSlug = createSlug(name)

        const schoolBySlug = await prisma.school.count({
          where: {
            slug: schoolSlug,
          },
        })

        schoolSlug = schoolBySlug
          ? `${schoolSlug}-${generateRandomHash()}`
          : schoolSlug

        if (domain) {
          const schoolByDomain = await prisma.school.count({
            where: {
              domain,
            },
          })

          if (schoolByDomain) {
            throw new BadRequestError(
              'Outra empresa com esse dominio já existe.',
            )
          }
        }

        const { id } = await prisma.school.create({
          data: {
            name,
            slug: schoolSlug,
            domain,
            ownerId: userId,
            shouldAttachUsersByDomain,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
          select: { id: true },
        })

        return reply.status(201).send({ companyId: id })
      },
    )
}
