import { UpdateClassRequest, UpdateClassResponse } from '@ecokids/types'

import { api } from '../api'

export async function updateClass({
  params: { schoolSlug, classId },
  body: { name, year },
}: UpdateClassRequest) {
  const result = await api
    .put(`schools/${schoolSlug}/classes/${classId}`, {
      json: { name, year },
    })
    .json<UpdateClassResponse>()

  return result
}
