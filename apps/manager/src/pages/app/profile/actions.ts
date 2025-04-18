import type { UpdateUserBody, UpdateUserPasswordBody } from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { updateUser } from '@/http/users/update-user'
import { updateUserPassword } from '@/http/users/update-user-password'

export async function updateUserAction({
  body: { name, cpf },
}: {
  body: UpdateUserBody
}) {
  try {
    await updateUser({
      body: {
        name,
        cpf,
      },
    })

    toast.success('Perfil atualizado com sucesso!')

    return {
      success: true,
      message: 'Perfil atualizado com sucesso!',
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

export async function updateUserPasswordAction({
  body: { currentPassword, newPassword, confirmPassword },
}: {
  body: UpdateUserPasswordBody
}) {
  try {
    await updateUserPassword({
      body: {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    })

    toast.success('Senha atualizado com sucesso!')

    return {
      success: true,
      message: 'Senha atualizado com sucesso!',
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
