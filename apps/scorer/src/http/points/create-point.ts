import { CreatePointRequest, CreatePointResponse } from '@ecokids/types'

import { api } from '../api'

export async function createPoint({
  params: { schoolSlug, studentId },
  body: { items },
}: CreatePointRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/students/${studentId}/points`, {
      json: {
        items,
      },
    })
    .json<CreatePointResponse>()

  return result
}
