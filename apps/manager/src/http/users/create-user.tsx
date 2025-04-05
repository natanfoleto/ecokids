import { CreateUserRequest, CreateUserResponse } from '@ecokids/types'

import { api } from '../api'

export async function createUser({
  body: { name, email, cpf, password, confirm_password },
}: CreateUserRequest) {
  const result = await api
    .post('users', {
      json: {
        name,
        email,
        cpf,
        password,
        confirm_password,
      },
    })
    .json<CreateUserResponse>()

  return result
}
