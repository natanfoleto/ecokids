import { type DeliverRedemptionRequest } from '@ecokids/types'

import { api } from '../api'

export async function deliverRedemption({
  params: { schoolSlug, redemptionId },
}: DeliverRedemptionRequest) {
  await api.patch(`schools/${schoolSlug}/redemptions/${redemptionId}/deliver`)
}
