import { type GetRedemptionsRequest, type GetRedemptionsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getRedemptions({
  params: { schoolSlug },
}: GetRedemptionsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/redemptions`)
    .json<GetRedemptionsResponse>()

  return result
}
