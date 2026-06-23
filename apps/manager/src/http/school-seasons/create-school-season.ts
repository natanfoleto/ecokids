import {
  type CreateSchoolSeasonRequest,
  type CreateSchoolSeasonResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function createSchoolSeason({
  params: { schoolSlug },
  body,
}: CreateSchoolSeasonRequest) {
  const result = await api
    .post(`schools/${schoolSlug}/school-seasons`, { json: body })
    .json<CreateSchoolSeasonResponse>()

  return result
}
