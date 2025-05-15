import { GetItemRequest, GetItemResponse } from '@ecokids/types'

import { api } from '../api'

export async function getItem({
  params: { schoolSlug, itemId },
}: GetItemRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/items/${itemId}`)
    .json<GetItemResponse>()

  return result
}
