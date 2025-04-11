import { RejectInviteRequest, RejectInviteResponse } from '@ecokids/types'

import { api } from '../api'

export async function rejectInvite({
  params: { inviteId },
}: RejectInviteRequest) {
  const result = await api
    .delete(`invites/${inviteId}/reject`)
    .json<RejectInviteResponse>()

  return result
}
