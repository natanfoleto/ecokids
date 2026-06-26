import {
  type UpdateSchoolSettingsRequest,
  type UpdateSchoolSettingsResponse,
} from '@ecokids/types'

import { api } from '../api'

export async function updateSchoolSettings({
  params: { schoolSlug },
  body: { nextSeasonMessage },
}: UpdateSchoolSettingsRequest) {
  const result = await api
    .put(`schools/${schoolSlug}/settings`, {
      json: { nextSeasonMessage },
    })
    .json<UpdateSchoolSettingsResponse>()

  return result
}
