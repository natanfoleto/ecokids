import {
  type CreateRedemptionRequest,
  type CreateRedemptionResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function createRedemption({
  params: { schoolSlug },
  body,
}: CreateRedemptionRequest) {
  const result = await api
    .post(`viewers/schools/${schoolSlug}/redemptions`, { json: body })
    .json<CreateRedemptionResponse>()

  return result
}
