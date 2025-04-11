import { RemoveMemberRequest, RemoveMemberResponse } from '@ecokids/types'

import { api } from '../api'

export async function removeMember({
  params: { schoolSlug, memberId },
}: RemoveMemberRequest) {
  const result = await api
    .delete(`schools/${schoolSlug}/members/${memberId}`)
    .json<RemoveMemberResponse>()

  return result
}
