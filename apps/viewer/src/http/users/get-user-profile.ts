import { GetUserProfileResponse } from '@ecokids/types'

import { api } from '../api'

export async function getUserProfile() {
  const result = await api.get('users/profile').json<GetUserProfileResponse>()

  return result
}
