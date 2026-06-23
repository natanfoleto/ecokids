import { z } from 'zod'

export const rewardRedemptionSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('RewardRedemption'),
])

export type RewardRedemptionSubject = z.infer<typeof rewardRedemptionSubject>
