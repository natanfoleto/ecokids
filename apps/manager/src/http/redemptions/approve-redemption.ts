import { type ApproveRedemptionRequest } from '@ecokids/types'

import { api } from '../api'

export async function approveRedemption({
  params: { schoolSlug, redemptionId },
  body,
}: ApproveRedemptionRequest) {
  await api.patch(`schools/${schoolSlug}/redemptions/${redemptionId}/approve`, {
    json: body,
  })
}
