import {
  AuthenticateStudentWithPasswordRequest,
  AuthenticateStudentWithPasswordResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function authenticateStudentWithPassword({
  body: { email, password },
}: AuthenticateStudentWithPasswordRequest) {
  const result = await api
    .post('authenticate/students/password', {
      json: {
        email,
        password,
      },
    })
    .json<AuthenticateStudentWithPasswordResponse>()

  return result
}
