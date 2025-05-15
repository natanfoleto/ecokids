import { CreateItemRequest, CreateItemResponse } from '@ecokids/types'

import { api } from '../api'

export async function createItem({
  params: { schoolSlug },
  body: { name, description, value },
}: CreateItemRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/items`, {
      json: {
        name,
        description,
        value,
      },
    })
    .json<CreateItemResponse>()

  return result
}
