import { UpdateStudentRequest, UpdateStudentResponse } from '@ecokids/types'

import { api } from '../api'

export async function updateStudent({
  params: { schoolSlug, studentId },
  body: { name, cpf, email, classId },
}: UpdateStudentRequest) {
  const result = await api
    .put(`schools/${schoolSlug}/students/${studentId}`, {
      json: { name, cpf, email, classId },
    })
    .json<UpdateStudentResponse>()

  return result
}
