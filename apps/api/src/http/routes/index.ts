import { FastifyInstance } from 'fastify'

import { registerAuthRoutes } from './auth'

export default async function (app: FastifyInstance) {
  await registerAuthRoutes(app)
}
