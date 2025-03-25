import { FastifyInstance } from 'fastify'

import { authenticateWithPassword } from './authenticate-with-password'
import { createUser } from './create-user'
import { getProfile } from './get-profile'
import { requestPasswordRecover } from './request-password-recover'
import { resetPassword } from './reset-password'

export async function registerAuthRoutes(app: FastifyInstance) {
  app.register(authenticateWithPassword)
  app.register(createUser)
  app.register(getProfile)
  app.register(resetPassword)
  app.register(requestPasswordRecover)
}
