import type { AcceptInviteRequest, RejectInviteRequest } from '@ecokids/types'
import { HTTPError } from 'ky'

import { acceptInvite } from '@/http/invites/accept-invite'
import { rejectInvite } from '@/http/invites/reject-invite'
import { queryClient } from '@/lib/react-query'

export async function acceptInviteAction({
  params: { inviteId },
}: AcceptInviteRequest) {
  try {
    await acceptInvite({
      params: {
        inviteId,
      },
    })

    queryClient.invalidateQueries({
      queryKey: ['schools'],
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
      errors: null,
    }
  }
}

export async function rejectInviteAction({
  params: { inviteId },
}: RejectInviteRequest) {
  try {
    await rejectInvite({
      params: {
        inviteId,
      },
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns minutos.',
      errors: null,
    }
  }
}
