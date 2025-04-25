import type {
  UpdateSchoolLogoParams,
  UpdateSchoolLogoResponse,
} from '@ecokids/types'

import { api } from '../api'

interface UpdateSchoolLogoRequest {
  params: UpdateSchoolLogoParams
  body: FormData
}

export async function updateSchoolLogo({
  params: { schoolSlug },
  body,
}: UpdateSchoolLogoRequest) {
  await api
    .patch(`schools/${schoolSlug}/logo`, {
      body,
    })
    .json<UpdateSchoolLogoResponse>()
}
