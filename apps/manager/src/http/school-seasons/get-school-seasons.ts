import {
  type GetSchoolSeasonsRequest,
  type GetSchoolSeasonsResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function getSchoolSeasons({
  params: { schoolSlug },
}: GetSchoolSeasonsRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/school-seasons`)
    .json<GetSchoolSeasonsResponse>()

  return result
}
