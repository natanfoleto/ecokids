import type { GetStudentsResponse } from '@ecokids/types'

import { api } from '../api'

interface GetStudentsOptions {
  params: {
    schoolSlug: string
  }
  query?: {
    search?: string
    limit?: number
    page?: number
  }
}

export async function getStudents({
  params: { schoolSlug },
  query,
}: GetStudentsOptions): Promise<GetStudentsResponse> {
  const searchParams: Record<string, string> = {}

  if (query?.search) searchParams.search = query.search
  if (query?.limit) searchParams.limit = String(query.limit)
  if (query?.page) searchParams.page = String(query.page)

  const result = await api
    .get(`schools/${schoolSlug}/students`, {
      searchParams,
    })
    .json<GetStudentsResponse>()

  return result
}
