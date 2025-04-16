import { DeleteStudentRequest, DeleteStudentResponse } from '@ecokids/types'

import { api } from '../api'

export async function deleteStudent({
  params: { schoolSlug, studentId },
}: DeleteStudentRequest) {
  const result = await api
    .delete(`schools/${schoolSlug}/students/${studentId}`)
    .json<DeleteStudentResponse>()

  return result
}
