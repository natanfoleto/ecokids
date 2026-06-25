import {
  type UpdateStudentPasswordRequest,
  type UpdateStudentPasswordResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function updateStudentPassword({
  body: { currentPassword, newPassword, confirmPassword },
}: UpdateStudentPasswordRequest) {
  const result = await api
    .patch('viewers/students/password', {
      json: {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    })
    .json<UpdateStudentPasswordResponse>()

  return result
}
