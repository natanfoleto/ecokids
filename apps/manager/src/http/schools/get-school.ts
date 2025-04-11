import { type GetSchoolRequest, GetSchoolResponse } from '@ecokids/types'

import { api } from '../api'

export async function getSchool({ params: { schoolSlug } }: GetSchoolRequest) {
  const result = await api
    .get(`schools/${schoolSlug}`)
    .json<GetSchoolResponse>()

  return result
}
