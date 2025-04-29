import {
  GetStudentByCodeRequest,
  GetStudentByCodeResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function getStudentByCode({
  params: { schoolSlug, code },
}: GetStudentByCodeRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/students/code/${code}`)
    .json<GetStudentByCodeResponse>()

  return result
}
