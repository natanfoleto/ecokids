import { GetAwardsRequest, GetAwardsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getAwards({ params: { schoolSlug } }: GetAwardsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/awards`)
    .json<GetAwardsResponse>()

  return result
}
