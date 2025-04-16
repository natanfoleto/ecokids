import type {
  CreateClassBody,
  CreateClassParams,
  UpdateClassBody,
  UpdateClassParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { getCurrentSchool } from '@/auth'
import { createClass } from '@/http/classes/create-class'
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

    toast.success('Classe criada com sucesso!')

    return {
      success: true,
      message: 'Classe criada com sucesso!',
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
  params: { classId },
  body: { name, year },
}: {
  body: UpdateClassBody
  params: UpdateClassParams
}) {
  const currentSchool = getCurrentSchool()

  try {
    await updateClass({
      params: { schoolSlug: currentSchool!, classId },
      body: {
        name,
        year,
      },
    })

    toast.success('Classe atualizada com sucesso!')

    return {
      success: true,
      message: 'Classe atualizada com sucesso!',
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
