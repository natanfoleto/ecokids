import { UpdateMemberRequest, UpdateMemberResponse } from '@ecokids/types'

import { api } from '../api'

export async function updateMember({
  params: { schoolSlug, memberId },
  body: { role },
}: UpdateMemberRequest) {
  const result = await api
    .put(`schools/${schoolSlug}/members/${memberId}`, {
      json: {
        role,
      },
    })
    .json<UpdateMemberResponse>()

  return result
}
