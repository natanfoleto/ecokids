import {
  type GetSchoolMetricsRequest,
  GetSchoolMetricsResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function getSchoolMetrics({
  params: { schoolSlug },
}: GetSchoolMetricsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/metrics`)
    .json<GetSchoolMetricsResponse>()

  return result
}
