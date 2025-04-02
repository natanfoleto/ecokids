import { FastifyInstance } from 'fastify'

import { registerAuthRoutes } from './auth'
import { registerClassRoutes } from './classes'
import { registerInvitesRoutes } from './invites'
import { registerMemberRoutes } from './members'
import { registerPointsRoutes } from './points'
import { registerSchoolRoutes } from './schools'
import { registerStudentRoutes } from './students'
import { registerUserRoutes } from './users'

export default async function (app: FastifyInstance) {
  await registerAuthRoutes(app)
  await registerUserRoutes(app)
  await registerSchoolRoutes(app)
  await registerInvitesRoutes(app)
  await registerMemberRoutes(app)
  await registerClassRoutes(app)
  await registerStudentRoutes(app)
  await registerPointsRoutes(app)
}
