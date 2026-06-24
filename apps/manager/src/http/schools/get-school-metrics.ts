import {
  type GetSchoolMetricsRequest,
  GetSchoolMetricsResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function getSchoolMetrics({
  params: { schoolSlug },
  query,
}: GetSchoolMetricsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/metrics`, {
      searchParams: query?.seasonId ? { seasonId: query.seasonId } : undefined,
    })
    .json<GetSchoolMetricsResponse>()

  return result
}
