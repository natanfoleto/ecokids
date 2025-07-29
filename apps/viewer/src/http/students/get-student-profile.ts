import { GetStudentProfileResponse } from '@ecokids/types'

import { api } from '../api'

export async function getStudentProfile() {
  const result = await api
    .get('profile/students')
    .json<GetStudentProfileResponse>()

  return result
}
