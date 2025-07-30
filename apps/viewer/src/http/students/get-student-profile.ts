import { GetStudentProfileResponse } from '@ecokids/types'

import { api } from '../api'

export async function getStudentProfile() {
  const result = await api
    .get('students/profile')
    .json<GetStudentProfileResponse>()

  return result
}
