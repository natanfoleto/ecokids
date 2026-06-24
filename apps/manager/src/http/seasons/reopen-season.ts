import {
  type ReopenSeasonRequest,
  type ReopenSeasonResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function reopenSeason({
  params: { schoolSlug, seasonId },
}: ReopenSeasonRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/seasons/${seasonId}/reopen`)
    .json<ReopenSeasonResponse>()

  return result
}
