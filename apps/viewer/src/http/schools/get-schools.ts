import { GetSchoolsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getSchools() {
  const result = await api.get('schools').json<GetSchoolsResponse>()

  return result
}
