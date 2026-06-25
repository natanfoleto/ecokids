import {
  getAuditLogsParamsSchema,
  getAuditLogsQuerySchema,
  getAuditLogsResponseSchema,
} from '@ecokids/types'
import { Prisma } from '@prisma/client'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { auth } from '@/http/middlewares/auth'
import { ForbiddenError } from '@/http/routes/_errors/forbidden-error'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getAuditLogs(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/schools/:schoolSlug/audit-logs',
      {
        schema: {
          tags: ['Auditoria'],
          summary: 'Obter logs de auditoria da escola',
          security: [{ bearerAuth: [] }],
          params: getAuditLogsParamsSchema,
          querystring: getAuditLogsQuerySchema,
          response: {
            200: getAuditLogsResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { schoolSlug } = request.params
        const userId = await request.getCurrentEntityId()
        const { school, membership } =
          await request.getUserMembership(schoolSlug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('get', 'AuditLog')) {
          throw new ForbiddenError(
            'Você não tem permissão para visualizar os logs de auditoria.',
          )
        }

        const {
          page,
          limit,
          search,
          actorId,
          actorType,
          entityType,
          action,
          period,
          startDate,
          endDate,
        } = request.query || {}

        const where: Prisma.AuditLogWhereInput = {
          schoolId: school.id,
        }

        if (actorId) where.actorId = actorId
        if (actorType) where.actorType = actorType
        if (entityType) where.entityType = entityType
        if (action) where.action = action

        // Period filter logic
        if (period) {
          const now = new Date()
          if (period === 'today') {
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
            )
            where.createdAt = { gte: today }
          } else if (period === '7days') {
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(now.getDate() - 7)
            where.createdAt = { gte: sevenDaysAgo }
          } else if (period === '30days') {
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(now.getDate() - 30)
            where.createdAt = { gte: thirtyDaysAgo }
          } else if (period === 'custom' && (startDate || endDate)) {
            const dateFilter: { gte?: Date; lte?: Date } = {}
            if (startDate) dateFilter.gte = new Date(startDate)
            if (endDate) dateFilter.lte = new Date(endDate)
            where.createdAt = dateFilter
          }
        } else if (startDate || endDate) {
          const dateFilter: { gte?: Date; lte?: Date } = {}
          if (startDate) dateFilter.gte = new Date(startDate)
          if (endDate) dateFilter.lte = new Date(endDate)
          where.createdAt = dateFilter
        }

        if (search) {
          // Find matching users by name
          const matchingUsers = await prisma.user.findMany({
            where: { name: { contains: search, mode: 'insensitive' } },
            select: { id: true },
          })
          const userIds = matchingUsers.map((u) => u.id)

          // Find matching students by name
          const matchingStudents = await prisma.student.findMany({
            where: {
              schoolId: school.id,
              name: { contains: search, mode: 'insensitive' },
            },
            select: { id: true },
          })
          const studentIds = matchingStudents.map((s) => s.id)

          const actorIds = [...userIds, ...studentIds]

          where.OR = [
            { description: { contains: search, mode: 'insensitive' } },
            { entityId: { contains: search, mode: 'insensitive' } },
            { action: { contains: search, mode: 'insensitive' } },
            ...(actorIds.length > 0 ? [{ actorId: { in: actorIds } }] : []),
          ]
        }

        // Count total matching logs
        const totalCount = await prisma.auditLog.count({ where })

        const limitVal = limit ? Number(limit) : 10
        const pageVal = page ? Number(page) : 1
        const skip = (pageVal - 1) * limitVal

        // Query logs
        const logs = await prisma.auditLog.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limitVal,
          skip,
        })

        // Fetch actor details in bulk for logs that have an actorId
        const uniqueActorIds = Array.from(
          new Set(logs.map((log) => log.actorId).filter(Boolean)),
        ) as string[]

        const users = await prisma.user.findMany({
          where: { id: { in: uniqueActorIds } },
          select: { id: true, name: true, email: true },
        })

        const students = await prisma.student.findMany({
          where: { id: { in: uniqueActorIds } },
          select: { id: true, name: true, email: true },
        })

        // Map logs with their actor information
        const auditLogs = logs.map((log) => {
          let actor = null
          if (log.actorId) {
            if (log.actorType === 'USER') {
              const u = users.find((user) => user.id === log.actorId)
              if (u) actor = { name: u.name, email: u.email }
            } else if (log.actorType === 'STUDENT') {
              const s = students.find((student) => student.id === log.actorId)
              if (s) actor = { name: s.name, email: s.email || null }
            }
          }

          return {
            ...log,
            actor,
          }
        })

        return reply.status(200).send({
          auditLogs,
          meta: {
            page: pageVal,
            limit: limitVal,
            totalCount,
            pageCount: limitVal > 0 ? Math.ceil(totalCount / limitVal) : 1,
          },
        })
      },
    )
}
