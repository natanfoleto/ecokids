import { DeleteAwardRequest, DeleteAwardResponse } from '@ecokids/types'

import { api } from '../api'

export async function deleteAward({
  params: { schoolSlug, awardId },
}: DeleteAwardRequest) {
  const result = await api
    .delete(`schools/${schoolSlug}/awards/${awardId}`)
    .json<DeleteAwardResponse>()

  return result
}
