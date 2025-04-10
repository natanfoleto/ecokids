import { CreateSchoolRequest, CreateSchoolResponse } from '@ecokids/types'

import { api } from '../api'

export async function createSchool({
  body: { name, domain, shouldAttachUsersByDomain },
}: CreateSchoolRequest) {
  const result = await api
    .post('schools', {
      json: { name, domain, shouldAttachUsersByDomain },
    })
    .json<CreateSchoolResponse>()

  return result
}
