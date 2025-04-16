import type {
  CreateClassBody,
  CreateClassParams,
  DeleteClassParams,
  UpdateClassBody,
  UpdateClassParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { createClass } from '@/http/classes/create-class'
import { deleteClass } from '@/http/classes/delete-class'
import { updateClass } from '@/http/classes/update-class'

export async function createClassAction({
  params: { schoolSlug },
  body: { name, year },
}: {
  params: CreateClassParams
  body: CreateClassBody
}) {
  try {
    await createClass({
      params: {
        schoolSlug: schoolSlug!,
      },
      body: {
        name,
        year,
      },
    })

    toast.success('Turma criada com sucesso!')

    return {
      success: true,
      message: 'Turma criada com sucesso!',
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

export async function updateClassAction({
  params: { schoolSlug, classId },
  body: { name, year },
}: {
  body: UpdateClassBody
  params: UpdateClassParams
}) {
  try {
    await updateClass({
      params: { schoolSlug, classId },
      body: {
        name,
        year,
      },
    })

    toast.success('Turma atualizada com sucesso!')

    return {
      success: true,
      message: 'Turma atualizada com sucesso!',
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

export async function deleteClassAction({
  params: { schoolSlug, classId },
}: {
  params: DeleteClassParams
}) {
  try {
    await deleteClass({
      params: { schoolSlug, classId },
    })

    toast.success('Turma deletada com sucesso!')

    return {
      success: true,
      message: 'Turma deletada com sucesso!',
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
