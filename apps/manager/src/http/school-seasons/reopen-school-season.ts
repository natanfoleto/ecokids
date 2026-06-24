import {
  type ReopenSchoolSeasonRequest,
  type ReopenSchoolSeasonResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function reopenSchoolSeason({
  params: { schoolSlug },
}: ReopenSchoolSeasonRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/school-seasons/reopen`)
    .json<ReopenSchoolSeasonResponse>()

  return result
}
