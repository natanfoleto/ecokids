import type {
  CreateStudentBody,
  CreateStudentParams,
  UpdateStudentBody,
  UpdateStudentParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'

import { createStudent } from '@/http/students/create-student'
import { updateStudent } from '@/http/students/update-student'

export async function createStudentAction({
  params: { schoolSlug },
  body: { code, name, cpf, email, password, confirm_password, classId },
}: {
  params: CreateStudentParams
  body: CreateStudentBody
}) {
  try {
    await createStudent({
      params: {
        schoolSlug: schoolSlug!,
      },
      body: {
        code,
        name,
        cpf,
        email,
        password,
        confirm_password,
        classId,
      },
    })

    return {
      success: true,
      message: 'Aluno criado com sucesso!',
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message }
    }

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
    }
  }
}

export async function updateStudentAction({
  params: { schoolSlug, studentId },
  body: { code, name, cpf, email, password, confirm_password, classId },
}: {
  body: UpdateStudentBody
  params: UpdateStudentParams
}) {
  try {
    await updateStudent({
      params: { schoolSlug, studentId },
      body: {
        code,
        name,
        cpf,
        email,
        password,
        confirm_password,
        classId,
      },
    })

    return {
      success: true,
      message: 'Aluno atualizado com sucesso!',
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message }
    }

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
    }
  }
}
