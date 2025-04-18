import {
  UpdateUserPasswordRequest,
  UpdateUserPasswordResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function updateUserPassword({
  body: { currentPassword, newPassword, confirmPassword },
}: UpdateUserPasswordRequest) {
  const result = await api
    .patch('users/password', {
      json: {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    })
    .json<UpdateUserPasswordResponse>()

  return result
}
