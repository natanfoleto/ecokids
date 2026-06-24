import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function healthCheck(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check da API',
        response: {
          200: z.object({
            status: z.literal('ok'),
            uptime: z.number(),
            timestamp: z.string(),
          }),
        },
      },
    },
    async (_, reply) => {
      return reply.send({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      })
    },
  )
}
