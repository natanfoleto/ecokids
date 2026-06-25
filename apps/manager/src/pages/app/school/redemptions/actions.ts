import { toast } from '@ecokids/ui'
import { HTTPError } from 'ky'

import { approveRedemption } from '@/http/redemptions/approve-redemption'
import { deliverRedemption } from '@/http/redemptions/deliver-redemption'
import { rejectRedemption } from '@/http/redemptions/reject-redemption'

export async function approveRedemptionAction({
  schoolSlug,
  redemptionId,
  pickupInstructions,
}: {
  schoolSlug: string
  redemptionId: string
  pickupInstructions?: string
}) {
  try {
    await approveRedemption({
      params: { schoolSlug, redemptionId },
      body: { pickupInstructions: pickupInstructions || null },
    })

    toast.success('Solicitação aprovada com sucesso!')

    return {
      success: true,
      message: 'Solicitação aprovada com sucesso!',
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

export async function rejectRedemptionAction({
  schoolSlug,
  redemptionId,
  rejectionReason,
}: {
  schoolSlug: string
  redemptionId: string
  rejectionReason: string
}) {
  try {
    await rejectRedemption({
      params: { schoolSlug, redemptionId },
      body: { rejectionReason },
    })

    toast.success('Solicitação rejeitada com sucesso!')

    return {
      success: true,
      message: 'Solicitação rejeitada com sucesso!',
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

export async function deliverRedemptionAction({
  schoolSlug,
  redemptionId,
}: {
  schoolSlug: string
  redemptionId: string
}) {
  try {
    await deliverRedemption({
      params: { schoolSlug, redemptionId },
    })

    toast.success('Prêmio marcado como entregue!')

    return {
      success: true,
      message: 'Prêmio marcado como entregue!',
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
