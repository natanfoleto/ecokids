import { UpdateUserRequest, UpdateUserResponse } from '@ecokids/types'

import { api } from '../api'

export async function updateUser({
  body: { name, cpf, password, oldPassword, confirmPassword },
}: UpdateUserRequest) {
  const result = await api
    .put('users', {
      json: {
        name,
        cpf,
        password,
        oldPassword,
        confirmPassword,
      },
    })
    .json<UpdateUserResponse>()

  return result
}
