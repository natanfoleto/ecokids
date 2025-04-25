import type {
  CreateSchoolBody,
  ShutdownSchoolParams,
  UpdateSchoolBody,
  UpdateSchoolLogoParams,
  UpdateSchoolParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { createSchool } from '@/http/schools/create-school'
import { shutdownSchool } from '@/http/schools/shutdown-school'
import { updateSchool } from '@/http/schools/update-school'
import { updateSchoolLogo } from '@/http/schools/update-school-logo'

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

export async function updateSchoolAction({
  params: { schoolSlug },
  body: { name, domain, shouldAttachUsersByDomain },
}: {
  params: UpdateSchoolParams
  body: UpdateSchoolBody
}) {
  try {
    await updateSchool({
      params: { schoolSlug },
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

export async function shutdownSchoolAction({
  params: { schoolSlug },
}: {
  params: ShutdownSchoolParams
}) {
  try {
    await shutdownSchool({
      params: { schoolSlug },
    })

    toast.success('Escola desligada com sucesso!')

    return {
      success: true,
      message: 'Escola desligada com sucesso!',
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

export async function updateSchoolLogoAction({
  params: { schoolSlug },
  body,
}: {
  params: UpdateSchoolLogoParams
  body: FormData
}) {
  try {
    await updateSchoolLogo({
      params: { schoolSlug },
      body,
    })

    toast.success('Logo atualizada com sucesso!')

    return {
      success: true,
      message: 'Logo atualizada com sucesso!',
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      toast.error(message)

      return { success: false, message }
    }

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
    }
  }
}
