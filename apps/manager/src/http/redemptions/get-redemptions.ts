import {
  type GetRedemptionsRequest,
  type GetRedemptionsResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function getRedemptions({
  params: { schoolSlug },
  query,
}: GetRedemptionsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/redemptions`, {
      searchParams: query
        ? {
            ...(query.page !== undefined ? { page: query.page } : {}),
            ...(query.limit !== undefined ? { limit: query.limit } : {}),
            ...(query.search !== undefined ? { search: query.search } : {}),
            ...(query.status !== undefined ? { status: query.status } : {}),
          }
        : undefined,
    })
    .json<GetRedemptionsResponse>()

  return result
}
