import { FastifyInstance } from 'fastify'

import { registerAuthRoutes } from './auth'
import { registerClassRoutes } from './classes'
import { registerInvitesRoutes } from './invites'
import { registerMemberRoutes } from './members'
import { registerSchoolRoutes } from './schools'

export default async function (app: FastifyInstance) {
  await registerAuthRoutes(app)
  await registerSchoolRoutes(app)
  await registerInvitesRoutes(app)
  await registerMemberRoutes(app)
  await registerClassRoutes(app)
}
