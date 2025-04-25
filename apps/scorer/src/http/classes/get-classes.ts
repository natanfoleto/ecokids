import { GetClassesRequest, GetClassesResponse } from '@ecokids/types'

import { api } from '../api'

export async function getClasses({
  params: { schoolSlug },
}: GetClassesRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/classes`)
    .json<GetClassesResponse>()

  return result
}
