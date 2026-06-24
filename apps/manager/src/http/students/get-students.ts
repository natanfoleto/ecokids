import { GetStudentsRequest, GetStudentsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getStudents({
  params: { schoolSlug },
  query,
}: GetStudentsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/students`, {
      searchParams: query
        ? {
            ...(query.page !== undefined ? { page: query.page } : {}),
            ...(query.limit !== undefined ? { limit: query.limit } : {}),
            ...(query.search !== undefined ? { search: query.search } : {}),
          }
        : undefined,
    })
    .json<GetStudentsResponse>()

  return result
}
