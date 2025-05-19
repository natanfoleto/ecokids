import { GetMembershipRequest, GetMembershipResponse } from '@ecokids/types'

import { api } from '../api'

export async function getMembership({
  params: { schoolSlug },
}: GetMembershipRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/membership`)
    .json<GetMembershipResponse>()

  return result
}
