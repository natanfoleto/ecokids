import type {
  UpdateAwardPhotoParams,
  UpdateAwardPhotoResponse,
} from '@ecokids/types'

import { api } from '../api'

interface UpdateAwardPhotoRequest {
  params: UpdateAwardPhotoParams
  body: FormData
}

export async function updateAwardPhoto({
  params: { schoolSlug, awardId },
  body,
}: UpdateAwardPhotoRequest) {
  await api
    .patch(`schools/${schoolSlug}/awards/${awardId}/photo`, {
      body,
    })
    .json<UpdateAwardPhotoResponse>()
}
