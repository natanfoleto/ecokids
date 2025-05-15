import { DeleteItemRequest, DeleteItemResponse } from '@ecokids/types'

import { api } from '../api'

export async function deleteItem({
  params: { schoolSlug, itemId },
}: DeleteItemRequest) {
  const result = await api
    .delete(`schools/${schoolSlug}/items/${itemId}`)
    .json<DeleteItemResponse>()

  return result
}
