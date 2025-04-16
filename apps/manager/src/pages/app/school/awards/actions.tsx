import type {
  CreateAwardBody,
  CreateAwardParams,
  DeleteAwardParams,
  UpdateAwardBody,
  UpdateAwardParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { createAward } from '@/http/awards/create-award'
import { deleteAward } from '@/http/awards/delete-award'
import { updateAward } from '@/http/awards/update-award'

export async function createAwardAction({
  params: { schoolSlug },
  body: { name, description, value },
}: {
  params: CreateAwardParams
  body: CreateAwardBody
}) {
  try {
    await createAward({
      params: {
        schoolSlug: schoolSlug!,
      },
      body: {
        name,
        description,
        value,
      },
    })

    toast.success('Prêmio criado com sucesso!')

    return {
      success: true,
      message: 'Prêmio criado com sucesso!',
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

export async function updateAwardAction({
  params: { schoolSlug, awardId },
  body: { name, description, value },
}: {
  body: UpdateAwardBody
  params: UpdateAwardParams
}) {
  try {
    await updateAward({
      params: { schoolSlug, awardId },
      body: {
        name,
        description,
        value,
      },
    })

    toast.success('Prêmio atualizado com sucesso!')

    return {
      success: true,
      message: 'Prêmio atualizado com sucesso!',
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

export async function deleteAwardAction({
  params: { schoolSlug, awardId },
}: {
  params: DeleteAwardParams
}) {
  try {
    await deleteAward({
      params: { schoolSlug, awardId },
    })

    toast.success('Prêmio deletado com sucesso!')

    return {
      success: true,
      message: 'Prêmio deletado com sucesso!',
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
