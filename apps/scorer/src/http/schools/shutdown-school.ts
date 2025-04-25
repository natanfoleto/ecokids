import { ShutdownSchoolRequest, ShutdownSchoolResponse } from '@ecokids/types'

import { api } from '../api'

export async function shutdownSchool({
  params: { schoolSlug },
}: ShutdownSchoolRequest) {
  const result = await api
    .delete(`schools/${schoolSlug}`)
    .json<ShutdownSchoolResponse>()

  return result
}
