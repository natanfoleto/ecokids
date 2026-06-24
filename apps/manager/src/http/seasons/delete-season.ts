import {
  type DeleteSeasonRequest,
  type DeleteSeasonResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function deleteSeason({
  params: { schoolSlug, seasonId },
}: DeleteSeasonRequest) {
  const result = await api
    .delete(`schools/${schoolSlug}/seasons/${seasonId}`)
    .json<DeleteSeasonResponse>()

  return result
}
