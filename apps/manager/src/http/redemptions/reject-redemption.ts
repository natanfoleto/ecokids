import { type RejectRedemptionRequest } from '@ecokids/types'

import { api } from '../api'

export async function rejectRedemption({
  params: { schoolSlug, redemptionId },
  body,
}: RejectRedemptionRequest) {
  await api.patch(`schools/${schoolSlug}/redemptions/${redemptionId}/reject`, {
    json: body,
  })
}
