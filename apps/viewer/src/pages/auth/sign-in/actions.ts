import type { AuthenticateStudentWithPasswordBody } from '@ecokids/types'
import { HTTPError } from 'ky'

import { authenticateStudentWithPassword } from '@/http/auth/authenticate-student-with-password'

export async function authenticateStudentWithPasswordAction({
  body,
}: {
  body: AuthenticateStudentWithPasswordBody
}) {
  const { email, password } = body

  try {
    await authenticateStudentWithPassword({
      body: {
        email,
        password,
      },
    })

    return {
      success: true,
      message: 'Logado com sucesso!',
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      console.log(message)

      return { success: false, message }
    }

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
    }
  }
}
