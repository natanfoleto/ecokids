import { FastifyInstance } from 'fastify'

import { acceptInvite } from './accept-invite'
import { createInvite } from './create-invite'
import { getInvite } from './get-invite'
import { getInvites } from './get-invites'
import { getPendingInvites } from './get-pending-invites'
import { rejectInvite } from './reject-invite'
import { revokeInvite } from './revoke-invite'

export async function registerInvitesRoutes(app: FastifyInstance) {
  app.register(createInvite)
  app.register(acceptInvite)
  app.register(revokeInvite)
  app.register(rejectInvite)
  app.register(getInvite)
  app.register(getInvites)
  app.register(getPendingInvites)
}
