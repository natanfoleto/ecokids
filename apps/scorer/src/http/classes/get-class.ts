import { GetClassRequest, GetClassResponse } from '@ecokids/types'

import { api } from '../api'

export async function getClass({
  params: { schoolSlug, classId },
}: GetClassRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/classes/${classId}`)
    .json<GetClassResponse>()

  return result
}
