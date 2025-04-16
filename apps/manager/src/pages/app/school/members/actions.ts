import type {
  CreateInviteBody,
  RemoveMemberParams,
  RevokeInviteParams,
  UpdateMemberBody,
  UpdateMemberParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

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

    toast.success('Convite criado com sucesso!')

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'invites'],
    })
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

    toast.success('Convite revogado com sucesso!')

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'invites'],
    })
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

    toast.success('Membro removido com sucesso!')

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'members'],
    })
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

    toast.success('Membro atualizado com sucesso!')

    queryClient.invalidateQueries({
      queryKey: ['schools', currentSchool, 'members'],
    })
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
