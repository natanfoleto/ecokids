import type {
  UpdateItemPhotoParams,
  UpdateItemPhotoResponse,
} from '@ecokids/types'

import { api } from '../api'

interface UpdateItemPhotoRequest {
  params: UpdateItemPhotoParams
  body: FormData
}

export async function updateItemPhoto({
  params: { schoolSlug, itemId },
  body,
}: UpdateItemPhotoRequest) {
  await api
    .patch(`schools/${schoolSlug}/items/${itemId}/photo`, {
      body,
    })
    .json<UpdateItemPhotoResponse>()
}
