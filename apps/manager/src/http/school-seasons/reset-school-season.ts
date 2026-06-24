import {
  type ResetSchoolSeasonRequest,
  type ResetSchoolSeasonResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function resetSchoolSeason({
  params: { schoolSlug },
}: ResetSchoolSeasonRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/school-seasons/reset`)
    .json<ResetSchoolSeasonResponse>()

  return result
}
