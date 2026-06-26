import { PrismaClient } from '@prisma/client'

import { buildDescription, mapOperationToAction } from './audit-service'
import { requestContextStorage } from './request-context'

export const basePrisma = new PrismaClient({
  log: [],
})

const AUDITED_MODELS = [
  'User',
  'Student',
  'Class',
  'School',
  'Member',
  'Invite',
  'Point',
  'Item',
  'Award',
  'ExchangeSeason',
  'RewardRedemption',
  'SchoolSeason',
  'SchoolSettings',
]

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (!AUDITED_MODELS.includes(model)) {
          return query(args)
        }

        const isWrite = [
          'create',
          'createMany',
          'update',
          'updateMany',
          'upsert',
          'delete',
          'deleteMany',
        ].includes(operation)

        if (!isWrite) {
          return query(args)
        }

        const store = requestContextStorage.getStore()

        let oldData: unknown = null
        if (operation === 'update' || operation === 'delete') {
          try {
            const client = basePrisma as unknown as Record<
              string,
              { findUnique: (args: { where: unknown }) => Promise<unknown> }
            >
            oldData = await client[model].findUnique({
              where: args.where,
            })
          } catch (e) {
            // ignore findUnique errors
          }
        }

        const result = await query(args)

        let newData: unknown = null
        if (
          operation === 'create' ||
          operation === 'update' ||
          operation === 'upsert'
        ) {
          newData = result
        }

        const resObj =
          result && typeof result === 'object'
            ? (result as Record<string, unknown>)
            : null
        const argsObj = args as Record<string, unknown>
        const whereObj = argsObj?.where as Record<string, unknown> | undefined
        const oldDataObj = oldData as Record<string, unknown> | null

        const entityId = resObj?.id || whereObj?.id || whereObj?.email || null
        const action = mapOperationToAction(model, operation, result)
        const description = buildDescription(model, operation, oldData, newData)

        const actorId = store?.actorId || null
        const actorType = store?.actorType || 'SYSTEM'
        const schoolId =
          store?.schoolId ||
          (resObj?.schoolId as string | null | undefined) ||
          (oldDataObj?.schoolId as string | null | undefined) ||
          null
        const ipAddress = store?.ipAddress || null
        const userAgent = store?.userAgent || null

        // Write the audit log to the database using the basePrisma instance
        // to bypass the query extension recursive check.
        await basePrisma.auditLog
          .create({
            data: {
              schoolId,
              actorId,
              actorType,
              entityType: model,
              entityId: entityId ? String(entityId) : null,
              action,
              description,
              oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
              newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
              ipAddress,
              userAgent,
            },
          })
          .catch((err) => {
            console.error('Failed to create automatic audit log:', err)
          })

        return result
      },
    },
  },
})
