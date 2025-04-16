import { DeleteClassRequest, DeleteClassResponse } from '@ecokids/types'

import { api } from '../api'

export async function deleteClass({
  params: { schoolSlug, classId },
}: DeleteClassRequest) {
  const result = await api
    .delete(`schools/${schoolSlug}/classes/${classId}`)
    .json<DeleteClassResponse>()

  return result
}
