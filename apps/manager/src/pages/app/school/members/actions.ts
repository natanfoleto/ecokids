import type {
  CreateInviteBody,
  CreateInviteParams,
  RemoveMemberParams,
  RevokeInviteParams,
  UpdateMemberBody,
  UpdateMemberParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { createInvite } from '@/http/invites/create-invite'
import { revokeInvite } from '@/http/invites/revoke-invite'
import { removeMember } from '@/http/members/remove-member'
import { updateMember } from '@/http/members/update-member'

export async function createInviteAction({
  params: { schoolSlug },
  body: { email, role },
}: {
  params: CreateInviteParams
  body: CreateInviteBody
}) {
  try {
    await createInvite({
      params: {
        schoolSlug,
      },
      body: {
        email,
        role,
      },
    })

    toast.success('Convite criado com sucesso!')

    return {
      success: true,
      message: 'Convite criado com sucesso!',
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

export async function revokeInviteAction({
  params: { schoolSlug, inviteId },
}: {
  params: RevokeInviteParams
}) {
  try {
    await revokeInvite({
      params: {
        schoolSlug,
        inviteId,
      },
    })

    toast.success('Convite revogado com sucesso!')

    return {
      success: true,
      message: 'Convite revogado com sucesso!',
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

export async function removeMemberAction({
  params: { schoolSlug, memberId },
}: {
  params: RemoveMemberParams
}) {
  try {
    await removeMember({
      params: {
        schoolSlug,
        memberId,
      },
    })

    toast.success('Membro removido com sucesso!')

    return {
      success: true,
      message: 'Membro removido com sucesso!',
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

export async function updateMemberAction({
  params: { schoolSlug, memberId },
  body: { role },
}: {
  params: UpdateMemberParams
  body: UpdateMemberBody
}) {
  try {
    await updateMember({
      params: {
        memberId,
        schoolSlug,
      },
      body: {
        role,
      },
    })

    toast.success('Membro atualizado com sucesso!')

    return {
      success: true,
      message: 'Membro atualizado com sucesso!',
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
