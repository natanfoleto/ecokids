import type { CreateSchoolBody, UpdateSchoolBody } from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

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

    toast.success('Escola criada com sucesso!')

    return {
      success: true,
      message: 'Escola criada com sucesso!',
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

    toast.success('Escola atualizada com sucesso!')

    return {
      success: true,
      message: 'Escola atualizada com sucesso!',
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
