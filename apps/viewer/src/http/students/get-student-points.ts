import { GetStudentPointsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getStudentPoints() {
  const result = await api
    .get('students/points')
    .json<GetStudentPointsResponse>()

  return result
}
