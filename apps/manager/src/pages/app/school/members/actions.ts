import type {
  CreateInviteBody,
  RemoveMemberParams,
  RevokeInviteParams,
  UpdateMemberBody,
  UpdateMemberParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'

import { getCurrentSchool } from '@/auth'
import { createInvite } from '@/http/invites/create-invite'
import { revokeInvite } from '@/http/invites/revoke-invite'
import { removeMember } from '@/http/members/remove-member'
import { updateMember } from '@/http/members/update-member'
import { queryClient } from '@/lib/react-query'

export async function createInviteAction({ body }: { body: CreateInviteBody }) {
  const currentSchool = getCurrentSchool()

  const { email, role } = body

  try {
    await createInvite({
      params: {
        schoolSlug: currentSchool!,
      },
      body: {
        email,
        role,
      },
    })

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'invites'],
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

  return {
    success: true,
    message: 'Convite criado com sucesso.',
    errors: null,
  }
}

export async function revokeInviteAction({
  params: { inviteId },
}: {
  params: RevokeInviteParams
}) {
  const currentSchool = getCurrentSchool()

  try {
    await revokeInvite({
      params: {
        schoolSlug: currentSchool!,
        inviteId,
      },
    })

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'invites'],
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

export async function removeMemberAction({
  params: { memberId },
}: {
  params: RemoveMemberParams
}) {
  const currentSchool = getCurrentSchool()

  try {
    await removeMember({
      params: {
        schoolSlug: currentSchool!,
        memberId,
      },
    })

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'invites'],
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

export async function updateMemberAction({
  params: { memberId },
  body: { role },
}: {
  params: UpdateMemberParams
  body: UpdateMemberBody
}) {
  const currentSchool = getCurrentSchool()

  try {
    await updateMember({
      params: {
        memberId,
        schoolSlug: currentSchool!,
      },
      body: {
        role,
      },
    })

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'invites'],
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
