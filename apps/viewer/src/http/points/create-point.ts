import { CreatePointRequest, CreatePointResponse } from '@ecokids/types'

import { api } from '../api'

export async function createPoint({
  params: { schoolSlug, studentId },
  body: { amount },
}: CreatePointRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/students/${studentId}/points`, {
      json: {
        amount,
      },
    })
    .json<CreatePointResponse>()

  return result
}
