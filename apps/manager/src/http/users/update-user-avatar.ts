import type { UpdateUserAvatarResponse } from '@ecokids/types'

import { api } from '../api'

interface UpdateUserAvatarRequest {
  body: FormData
}

export async function updateUserAvatar({ body }: UpdateUserAvatarRequest) {
  await api
    .patch(`users/avatar`, {
      body,
    })
    .json<UpdateUserAvatarResponse>()
}
