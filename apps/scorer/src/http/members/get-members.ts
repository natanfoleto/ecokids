import { GetMembersRequest, GetMembersResponse } from '@ecokids/types'

import { api } from '../api'

export async function getMembers({
  params: { schoolSlug },
}: GetMembersRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/members`)
    .json<GetMembersResponse>()

  return result
}
