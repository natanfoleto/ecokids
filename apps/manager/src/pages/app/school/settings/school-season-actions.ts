import {
  type CreateSchoolSeasonBody,
  type FinishSchoolSeasonBody,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { createSchoolSeason } from '@/http/school-seasons/create-school-season'
import { finishSchoolSeason } from '@/http/school-seasons/finish-school-season'

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
