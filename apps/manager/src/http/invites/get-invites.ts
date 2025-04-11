import { GetInvitesRequest, GetInvitesResponse } from '@ecokids/types'

import { api } from '../api'

export async function getInvites({
  params: { schoolSlug },
}: GetInvitesRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/invites`)
    .json<GetInvitesResponse>()

  return result
}
