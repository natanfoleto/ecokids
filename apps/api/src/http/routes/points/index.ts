import { FastifyInstance } from 'fastify'

import { createPoint } from './create-point'

export async function registerPointRoutes(app: FastifyInstance) {
  app.register(createPoint)
}
