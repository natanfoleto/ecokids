import { type GetStudentRedemptionsResponse } from '@ecokids/types'

import { api } from '../api'

export async function getStudentRedemptions() {
  const result = await api
    .get('viewers/students/redemptions')
    .json<GetStudentRedemptionsResponse>()

  return result
}
