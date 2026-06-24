import { GetClassesRequest, GetClassesResponse } from '@ecokids/types'

import { api } from '../api'

export async function getClasses({
  params: { schoolSlug },
  query,
}: GetClassesRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/classes`, {
      searchParams: query
        ? {
            ...(query.page !== undefined ? { page: query.page } : {}),
            ...(query.limit !== undefined ? { limit: query.limit } : {}),
            ...(query.search !== undefined ? { search: query.search } : {}),
          }
        : undefined,
    })
    .json<GetClassesResponse>()

  return result
}
