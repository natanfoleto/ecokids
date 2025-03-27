import { z } from 'zod'

import { companySchema } from '../models/company'

export const companySubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.union([z.literal('Company'), companySchema]),
])

export type CompanySubject = z.infer<typeof companySubject>
