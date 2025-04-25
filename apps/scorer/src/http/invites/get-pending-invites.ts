import { GetPendingInvitesResponse } from '@ecokids/types'

import { api } from '../api'

export async function getPendingInvites() {
  const result = await api
    .get('pending-invites')
    .json<GetPendingInvitesResponse>()

  return result
}
