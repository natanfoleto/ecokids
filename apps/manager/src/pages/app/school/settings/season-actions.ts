import { type CreateSeasonBody } from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { closeSeason } from '@/http/seasons/close-season'
import { createSeason } from '@/http/seasons/create-season'

export async function openSeasonAction({
  schoolSlug,
  body,
}: {
  schoolSlug: string
  body: CreateSeasonBody
}) {
  try {
    await createSeason({
      params: { schoolSlug },
      body,
    })

    toast.success('Temporada de trocas aberta com sucesso!')

    return {
      success: true,
      message: 'Temporada de trocas aberta com sucesso!',
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

export async function closeSeasonAction({
  schoolSlug,
}: {
  schoolSlug: string
}) {
  try {
    await closeSeason({
      params: { schoolSlug },
    })

    toast.success('Temporada de trocas fechada com sucesso!')

    return {
      success: true,
      message: 'Temporada de trocas fechada com sucesso!',
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
