import type { CreatePointBody, CreatePointParams } from '@ecokids/types'
import { HTTPError } from 'ky'

import { createPoint } from '@/http/points/create-point'

export async function createPointAction({
  params: { schoolSlug, studentId },
  body: { items },
}: {
  params: CreatePointParams
  body: CreatePointBody
}) {
  try {
    await createPoint({
      params: {
        schoolSlug,
        studentId,
      },
      body: {
        items,
      },
    })

    return {
      success: true,
      message: 'Aluno pontuado com sucesso!',
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
