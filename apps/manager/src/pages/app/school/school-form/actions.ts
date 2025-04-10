import type { CreateSchoolBody, UpdateSchoolBody } from '@ecokids/types'
import { HTTPError } from 'ky'

import { getCurrentSchool } from '@/auth'
import { createSchool } from '@/http/schools/create-school'
import { updateSchool } from '@/http/schools/update-school'

export async function createSchoolAction({ body }: { body: CreateSchoolBody }) {
  const { name, domain, shouldAttachUsersByDomain } = body

  try {
    await createSchool({
      body: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })

    return {
      success: true,
      message: 'Escola criada com sucesso!',
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

export async function updateSchoolAction({ body }: { body: UpdateSchoolBody }) {
  const { name, domain, shouldAttachUsersByDomain } = body

  const currentSchool = getCurrentSchool()

  try {
    await updateSchool({
      params: { schoolSlug: currentSchool! },
      body: {
        name,
        domain,
        shouldAttachUsersByDomain,
      },
    })

    return {
      success: true,
      message: 'Escola atualizada com sucesso!',
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
