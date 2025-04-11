import { CreateInviteRequest, CreateInviteResponse } from '@ecokids/types'

import { api } from '../api'

export async function createInvite({
  params: { schoolSlug },
  body: { email, role },
}: CreateInviteRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/invites`, {
      json: {
        email,
        role,
      },
    })
    .json<CreateInviteResponse>()

  return result
}
