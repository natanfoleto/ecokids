import {
  type FinishSchoolSeasonRequest,
  type FinishSchoolSeasonResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function finishSchoolSeason({
  params: { schoolSlug },
  body,
}: FinishSchoolSeasonRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/school-seasons/finish`, { json: body })
    .json<FinishSchoolSeasonResponse>()

  return result
}
