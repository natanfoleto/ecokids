import { UpdateItemRequest, UpdateItemResponse } from '@ecokids/types'

import { api } from '../api'

export async function updateItem({
  params: { schoolSlug, itemId },
  body: { name, description, value },
}: UpdateItemRequest) {
  const result = await api
    .put(`schools/${schoolSlug}/items/${itemId}`, {
      json: { name, description, value },
    })
    .json<UpdateItemResponse>()

  return result
}
