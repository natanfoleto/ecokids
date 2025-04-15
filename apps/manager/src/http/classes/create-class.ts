import { CreateClassRequest, CreateClassResponse } from '@ecokids/types'

import { api } from '../api'

export async function createClass({
  params: { schoolSlug },
  body: { name, year },
}: CreateClassRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/classes`, {
      json: {
        name,
        year,
      },
    })
    .json<CreateClassResponse>()

  return result
}
