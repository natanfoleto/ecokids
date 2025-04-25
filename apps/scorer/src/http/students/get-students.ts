import { GetStudentsRequest, GetStudentsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getStudents({
  params: { schoolSlug },
}: GetStudentsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/students`)
    .json<GetStudentsResponse>()

  return result
}
