import { FastifyInstance } from 'fastify'

import { createClass } from './create-class'
import { deleteClass } from './delete-class'
import { getClass } from './get-class'
import { getClasses } from './get-classes'
import { updateClass } from './update-class'

export async function registerClassRoutes(app: FastifyInstance) {
  app.register(createClass)
  app.register(getClass)
  app.register(getClasses)
  app.register(updateClass)
  app.register(deleteClass)
}
