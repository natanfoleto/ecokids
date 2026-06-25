import {
  type CreateSchoolSeasonBody,
  type FinishSchoolSeasonBody,
} from '@ecokids/types'
import { toast } from '@ecokids/ui'
import { HTTPError } from 'ky'

import { createSchoolSeason } from '@/http/school-seasons/create-school-season'
import { finishSchoolSeason } from '@/http/school-seasons/finish-school-season'
import { reopenSchoolSeason } from '@/http/school-seasons/reopen-school-season'
import { resetSchoolSeason } from '@/http/school-seasons/reset-school-season'

export async function createSchoolSeasonAction({
  schoolSlug,
  body,
}: {
  schoolSlug: string
  body: CreateSchoolSeasonBody
}) {
  try {
    await createSchoolSeason({
      params: { schoolSlug },
      body,
    })

    toast.success('Ciclo de pontuação iniciado com sucesso!')

    return {
      success: true,
      message: 'Ciclo de pontuação iniciado com sucesso!',
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

export async function finishSchoolSeasonAction({
  schoolSlug,
  body,
}: {
  schoolSlug: string
  body: FinishSchoolSeasonBody
}) {
  try {
    await finishSchoolSeason({
      params: { schoolSlug },
      body,
    })

    toast.success('Ciclo de pontuação encerrado e próximo ciclo iniciado!')

    return {
      success: true,
      message: 'Ciclo de pontuação encerrado e próximo ciclo iniciado!',
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

export async function reopenSchoolSeasonAction({
  schoolSlug,
}: {
  schoolSlug: string
}) {
  try {
    await reopenSchoolSeason({
      params: { schoolSlug },
    })

    toast.success('Último ciclo de pontuação reaberto com sucesso!')

    return {
      success: true,
      message: 'Último ciclo de pontuação reaberto com sucesso!',
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

export async function resetSchoolSeasonAction({
  schoolSlug,
}: {
  schoolSlug: string
}) {
  try {
    await resetSchoolSeason({
      params: { schoolSlug },
    })

    toast.success('Ciclo de pontuação resetado com sucesso!')

    return {
      success: true,
      message: 'Ciclo de pontuação resetado com sucesso!',
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
