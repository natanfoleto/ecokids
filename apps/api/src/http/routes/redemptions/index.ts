import type { FastifyInstance } from 'fastify'

import { approveRedemption } from './approve-redemption'
import { deliverRedemption } from './deliver-redemption'
import { getRedemptions } from './get-redemptions'
import { rejectRedemption } from './reject-redemption'

export async function registerRedemptionRoutes(app: FastifyInstance) {
  app.register(getRedemptions)
  app.register(approveRedemption)
  app.register(rejectRedemption)
  app.register(deliverRedemption)
}
