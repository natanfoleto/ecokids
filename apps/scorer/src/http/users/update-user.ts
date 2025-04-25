import { UpdateUserRequest, UpdateUserResponse } from '@ecokids/types'

import { api } from '../api'

export async function updateUser({ body: { name, cpf } }: UpdateUserRequest) {
  const result = await api
    .put('users', {
      json: {
        name,
        cpf,
      },
    })
    .json<UpdateUserResponse>()

  return result
}
