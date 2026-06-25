import { GetAuditLogsRequest, GetAuditLogsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getAuditLogs({
  params: { schoolSlug },
  query,
}: GetAuditLogsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/audit-logs`, {
      searchParams: query
        ? {
            ...(query.page !== undefined ? { page: query.page } : {}),
            ...(query.limit !== undefined ? { limit: query.limit } : {}),
            ...(query.search !== undefined ? { search: query.search } : {}),
            ...(query.actorId !== undefined ? { actorId: query.actorId } : {}),
            ...(query.actorType !== undefined
              ? { actorType: query.actorType }
              : {}),
            ...(query.entityType !== undefined
              ? { entityType: query.entityType }
              : {}),
            ...(query.action !== undefined ? { action: query.action } : {}),
            ...(query.period !== undefined ? { period: query.period } : {}),
            ...(query.startDate !== undefined
              ? { startDate: query.startDate }
              : {}),
            ...(query.endDate !== undefined ? { endDate: query.endDate } : {}),
          }
        : undefined,
    })
    .json<GetAuditLogsResponse>()

  return result
}
