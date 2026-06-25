import { FastifyInstance } from 'fastify'

import { registerAuditLogsRoutes } from './audit-logs'
import { registerAuthRoutes } from './auth'
import { registerAwardRoutes } from './awards'
import { registerClassRoutes } from './classes'
import { registerInviteRoutes } from './invites'
import { registerItemRoutes } from './items'
import { registerMemberRoutes } from './members'
import { registerPointRoutes } from './points'
import { registerRedemptionRoutes } from './redemptions'
import { registerSchoolSeasonRoutes } from './school-seasons'
import { registerSchoolRoutes } from './schools'
import { registerSeasonRoutes } from './seasons'
import { registerStudentRoutes } from './students'
import { registerUserRoutes } from './users'
import { registerViewerRoutes } from './viewers'

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
  await registerItemRoutes(app)
  await registerViewerRoutes(app)
  await registerSeasonRoutes(app)
  await registerRedemptionRoutes(app)
  await registerSchoolSeasonRoutes(app)
  await registerAuditLogsRoutes(app)
}
