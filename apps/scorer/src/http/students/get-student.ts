import { GetStudentRequest, GetStudentResponse } from '@ecokids/types'

import { api } from '../api'

export async function getStudent({
  params: { schoolSlug, studentId },
}: GetStudentRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/students/${studentId}`)
    .json<GetStudentResponse>()

  return result
}
