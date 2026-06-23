import { type CloseSeasonRequest, type CloseSeasonResponse } from '@ecokids/types'

import { api } from '../api'

export async function closeSeason({
  params: { schoolSlug },
}: CloseSeasonRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/seasons/close`)
    .json<CloseSeasonResponse>()

  return result
}
