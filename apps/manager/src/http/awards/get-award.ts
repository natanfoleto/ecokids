import { GetAwardRequest, GetAwardResponse } from '@ecokids/types'

import { api } from '../api'

export async function getAward({
  params: { schoolSlug, awardId },
}: GetAwardRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/awards/${awardId}`)
    .json<GetAwardResponse>()

  return result
}
