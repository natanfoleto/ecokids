import { type CancelRedemptionRequest } from '@ecokids/types'

import { api } from '../api'

export async function cancelRedemption({
  params: { redemptionId },
}: CancelRedemptionRequest) {
  await api.post(`viewers/redemptions/${redemptionId}/cancel`)
}
