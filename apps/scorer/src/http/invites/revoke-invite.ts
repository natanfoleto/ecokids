import { RevokeInviteRequest, RevokeInviteResponse } from '@ecokids/types'

import { api } from '../api'

export async function revokeInvite({
  params: { schoolSlug, inviteId },
}: RevokeInviteRequest) {
  const result = await api
    .delete(`schools/${schoolSlug}/invites/${inviteId}`)
    .json<RevokeInviteResponse>()

  return result
}
