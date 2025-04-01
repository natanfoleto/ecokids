import { FastifyInstance } from 'fastify'

import { createUser } from './create-user'
import { getUserProfile } from './get-user-profile'

export async function registerUserRoutes(app: FastifyInstance) {
  app.register(createUser)
  app.register(getUserProfile)
}
