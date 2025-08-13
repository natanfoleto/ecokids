import {
  GetSchoolRankingRequest,
  GetSchoolRankingResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function getSchoolRanking({
  params: { schoolId },
  query,
}: GetSchoolRankingRequest) {
  const result = await api
    .get(`viewers/schools/${schoolId}/ranking`, {
      searchParams: query,
    })
    .json<GetSchoolRankingResponse>()

  return result
}
