import { FastifyInstance } from 'fastify'

import { createAward } from './create-award'
import { deleteAward } from './delete-award'
import { getAward } from './get-award'
import { getAwards } from './get-awards'
import { updateAward } from './update-award'
import { updateAwardPhoto } from './update-award-photo'

export async function registerAwardRoutes(app: FastifyInstance) {
  app.register(createAward)
  app.register(updateAward)
  app.register(deleteAward)
  app.register(getAward)
  app.register(getAwards)
  app.register(updateAwardPhoto)
}
