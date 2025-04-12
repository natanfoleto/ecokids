import { GetInviteRequest, GetInviteResponse } from '@ecokids/types'

import { api } from '../api'

export async function getInvite({ params: { inviteId } }: GetInviteRequest) {
  const result = await api.get(`invites/${inviteId}`).json<GetInviteResponse>()

  return result
}
