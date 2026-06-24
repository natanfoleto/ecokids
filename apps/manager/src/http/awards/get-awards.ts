import { GetAwardsRequest, GetAwardsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getAwards({
  params: { schoolSlug },
  query,
}: GetAwardsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/awards`, {
      searchParams: query
        ? {
            ...(query.page !== undefined ? { page: query.page } : {}),
            ...(query.limit !== undefined ? { limit: query.limit } : {}),
            ...(query.search !== undefined ? { search: query.search } : {}),
          }
        : undefined,
    })
    .json<GetAwardsResponse>()

  return result
}
