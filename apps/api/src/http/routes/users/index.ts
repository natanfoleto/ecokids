import { FastifyInstance } from 'fastify'

import { createUser } from './create-user'
import { getUserProfile } from './get-user-profile'
import { updateUserAvatar } from './update-avatar'
import { updateUser } from './update-user'

export async function registerUserRoutes(app: FastifyInstance) {
  app.register(createUser)
  app.register(updateUser)
  app.register(updateUserAvatar)
  app.register(getUserProfile)
}
