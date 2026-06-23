import {
  type CreateSeasonRequest,
  type CreateSeasonResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function createSeason({
  params: { schoolSlug },
  body,
}: CreateSeasonRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/seasons`, { json: body })
    .json<CreateSeasonResponse>()

  return result
}
