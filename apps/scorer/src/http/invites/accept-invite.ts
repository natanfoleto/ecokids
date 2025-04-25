import { AcceptInviteRequest, AcceptInviteResponse } from '@ecokids/types'

import { api } from '../api'

export async function acceptInvite({
  params: { inviteId },
}: AcceptInviteRequest) {
  const result = await api
    .post(`invites/${inviteId}/accept`)
    .json<AcceptInviteResponse>()

  return result
}
