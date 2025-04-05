import type { CreateUserBody } from '@ecokids/types'
import { HTTPError } from 'ky'

import { createUser } from '@/http/users/create-user'

export async function createUserAction({ body }: { body: CreateUserBody }) {
  const { name, email, cpf, password, confirm_password } = body

  try {
    await createUser({
      body: {
        name,
        email,
        cpf,
        password,
        confirm_password,
      },
    })

    return {
      success: true,
      message: 'Cadastrado com sucesso!',
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
