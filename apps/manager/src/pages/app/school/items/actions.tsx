import type {
  CreateItemBody,
  CreateItemParams,
  DeleteItemParams,
  UpdateItemBody,
  UpdateItemParams,
  UpdateItemPhotoParams,
} from '@ecokids/types'
import { HTTPError } from 'ky'
import { toast } from 'sonner'

import { createItem } from '@/http/items/create-item'
import { deleteItem } from '@/http/items/delete-item'
import { updateItem } from '@/http/items/update-item'
import { updateItemPhoto } from '@/http/items/update-item-photo'

export async function createItemAction({
  params: { schoolSlug },
  body: { name, description, value },
}: {
  params: CreateItemParams
  body: CreateItemBody
}) {
  try {
    const item = await createItem({
      params: {
        schoolSlug: schoolSlug!,
      },
      body: {
        name,
        description,
        value,
      },
    })

    toast.success('Item criado com sucesso!')

    return {
      success: true,
      message: 'Item criado com sucesso!',
      data: item,
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

export async function updateItemAction({
  params: { schoolSlug, itemId },
  body: { name, description, value },
}: {
  body: UpdateItemBody
  params: UpdateItemParams
}) {
  try {
    await updateItem({
      params: { schoolSlug, itemId },
      body: {
        name,
        description,
        value,
      },
    })

    toast.success('Item atualizado com sucesso!')

    return {
      success: true,
      message: 'Item atualizado com sucesso!',
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

export async function deleteItemAction({
  params: { schoolSlug, itemId },
}: {
  params: DeleteItemParams
}) {
  try {
    await deleteItem({
      params: { schoolSlug, itemId },
    })

    toast.success('Item deletado com sucesso!')

    return {
      success: true,
      message: 'Item deletado com sucesso!',
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

export async function updateItemPhotoAction({
  params: { schoolSlug, itemId },
  body,
}: {
  params: UpdateItemPhotoParams
  body: FormData
}) {
  try {
    await updateItemPhoto({
      params: { schoolSlug, itemId },
      body,
    })

    // toast.success('Foto atualizada com sucesso!')

    return {
      success: true,
      message: 'Foto atualizada com sucesso!',
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
