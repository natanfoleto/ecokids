import { FastifyInstance } from 'fastify'

import { createUser } from './create-user'
import { getUserProfile } from './get-user-profile'
import { updateUser } from './update-user'
import { updateUserAvatar } from './update-user-avatar'
import { updateUserPassword } from './update-user-password'

export async function registerUserRoutes(app: FastifyInstance) {
  app.register(createUser)
  app.register(updateUser)
  app.register(getUserProfile)
  app.register(updateUserPassword)
  app.register(updateUserAvatar)
}
