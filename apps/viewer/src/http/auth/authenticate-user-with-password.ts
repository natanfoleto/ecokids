import {
  AuthenticateUserWithPasswordRequest,
  AuthenticateUserWithPasswordResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function authenticateUserWithPassword({
  body: { email, password },
}: AuthenticateUserWithPasswordRequest) {
  const result = await api
    .post('authenticate/users/password', {
      json: {
        email,
        password,
      },
    })
    .json<AuthenticateUserWithPasswordResponse>()

  return result
}
