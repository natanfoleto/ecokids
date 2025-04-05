import type { AuthenticateUserWithPasswordBody } from '@ecokids/types'
import { HTTPError } from 'ky'

import { authenticateUserWithPassword } from '@/http/auth/authenticate-user-with-password'

export async function authenticateUserWithPasswordAction({
  body,
}: {
  body: AuthenticateUserWithPasswordBody
}) {
  const { email, password } = body

  try {
    await authenticateUserWithPassword({
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
