import { GetUserProfileResponse } from '@ecokids/types'

import { api } from '../api'

export async function getUserProfile() {
  const result = await api.get('profile/users').json<GetUserProfileResponse>()

  return result
}
