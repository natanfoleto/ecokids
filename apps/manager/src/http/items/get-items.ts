import { GetItemsRequest, GetItemsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getItems({
  params: { schoolSlug },
  query,
}: GetItemsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/items`, {
      searchParams: query
        ? {
            ...(query.page !== undefined ? { page: query.page } : {}),
            ...(query.limit !== undefined ? { limit: query.limit } : {}),
            ...(query.search !== undefined ? { search: query.search } : {}),
          }
        : undefined,
    })
    .json<GetItemsResponse>()

  return result
}
