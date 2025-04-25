import { CreateStudentRequest, CreateStudentResponse } from '@ecokids/types'

import { api } from '../api'

export async function createStudent({
  params: { schoolSlug },
  body: { code, name, email, cpf, password, confirmPassword, classId },
}: CreateStudentRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/students`, {
      json: {
        code,
        name,
        email,
        cpf,
        password,
        confirmPassword,
        classId,
      },
    })
    .json<CreateStudentResponse>()

  return result
}
