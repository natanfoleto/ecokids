import type {
  CreateStudentBody,
  CreateStudentParams,
  UpdateStudentBody,
  UpdateStudentParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

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

    toast.success('Aluno criado com sucesso!')

    return {
      success: true,
      message: 'Aluno criado com sucesso!',
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      toast.error(message)

      return { success: false, message }
    }

    toast.error('Erro inesperado, tente novamente em alguns minutos.')

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

    toast.success('Aluno atualizado com sucesso!')

    return {
      success: true,
      message: 'Aluno atualizado com sucesso!',
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      toast.error(message)

      return { success: false, message }
    }

    toast.error('Erro inesperado, tente novamente em alguns minutos.')

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
    }
  }
}
