import { CreateAwardRequest, CreateAwardResponse } from '@ecokids/types'

import { api } from '../api'

export async function createAward({
  params: { schoolSlug },
  body: { name, description, value },
}: CreateAwardRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/awards`, {
      json: {
        name,
        description,
        value,
      },
    })
    .json<CreateAwardResponse>()

  return result
}
