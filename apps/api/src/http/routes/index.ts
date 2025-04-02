import { FastifyInstance } from 'fastify'

import { registerAuthRoutes } from './auth'
import { registerAwardRoutes } from './awards'
import { registerClassRoutes } from './classes'
import { registerInviteRoutes } from './invites'
import { registerMemberRoutes } from './members'
import { registerPointRoutes } from './points'
import { registerSchoolRoutes } from './schools'
import { registerStudentRoutes } from './students'
import { registerUserRoutes } from './users'

export default async function (app: FastifyInstance) {
  await registerAuthRoutes(app)
  await registerUserRoutes(app)
  await registerSchoolRoutes(app)
  await registerInviteRoutes(app)
  await registerMemberRoutes(app)
  await registerClassRoutes(app)
  await registerStudentRoutes(app)
  await registerPointRoutes(app)
  await registerAwardRoutes(app)
}
