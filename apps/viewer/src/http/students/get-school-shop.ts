import { GetSchoolShopRequest, GetSchoolShopResponse } from '@ecokids/types'

import { api } from '../api'

export async function getSchoolShop({
  params: { schoolId },
}: GetSchoolShopRequest) {
  const result = await api
    .get(`schools/${schoolId}/shop`)
    .json<GetSchoolShopResponse>()

  return result
}
