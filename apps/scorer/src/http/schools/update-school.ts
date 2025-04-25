import { UpdateSchoolRequest, UpdateSchoolResponse } from '@ecokids/types'

import { api } from '../api'

export async function updateSchool({
  params: { schoolSlug },
  body: { name, domain, shouldAttachUsersByDomain },
}: UpdateSchoolRequest) {
  const result = await api
    .put(`schools/${schoolSlug}`, {
      json: { name, domain, shouldAttachUsersByDomain },
    })
    .json<UpdateSchoolResponse>()

  return result
}
