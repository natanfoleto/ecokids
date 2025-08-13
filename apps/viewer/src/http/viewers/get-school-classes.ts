import {
  GetSchoolClassesRequest,
  GetSchoolClassesResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function getSchoolClasses({
  params: { schoolId },
}: GetSchoolClassesRequest) {
  const result = await api
    .get(`viewers/schools/${schoolId}/classes`)
    .json<GetSchoolClassesResponse>()

  return result
}
