import { UpdateAwardRequest, UpdateAwardResponse } from '@ecokids/types'

import { api } from '../api'

export async function updateAward({
  params: { schoolSlug, awardId },
  body: { name, description, value },
}: UpdateAwardRequest) {
  const result = await api
    .put(`schools/${schoolSlug}/awards/${awardId}`, {
      json: { name, description, value },
    })
    .json<UpdateAwardResponse>()

  return result
}
