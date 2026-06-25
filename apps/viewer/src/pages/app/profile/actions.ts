import type { UpdateStudentPasswordBody } from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { updateStudentPassword } from '@/http/viewers/update-student-password'

export async function updateStudentPasswordAction({
  body: { currentPassword, newPassword, confirmPassword },
}: {
  body: UpdateStudentPasswordBody
}) {
  try {
    await updateStudentPassword({
      body: {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    })

    toast.success('Senha alterada com sucesso!')

    return {
      success: true,
      message: 'Senha alterada com sucesso!',
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
