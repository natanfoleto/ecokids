import { type GetSeasonsRequest, type GetSeasonsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getSeasons({
  params: { schoolSlug },
}: GetSeasonsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/seasons`)
    .json<GetSeasonsResponse>()

  return result
}
