import { GetItemsRequest, GetItemsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getItems({ params: { schoolSlug } }: GetItemsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/items`)
    .json<GetItemsResponse>()

  return result
}
