import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from '@/http/error-handler'
import routes from '@/http/routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Ecokids',
      description: 'Documentação dos recursos do Ecokids API.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: 'ecokids',
})

app.register(fastifyCookie, {
  secret: 'ecokids',
})

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  credentials: true,
})

app.register(routes)

app
  .listen({ port: 3333, host: '0.0.0.0' })
  .then(() => {
    console.log('🚀 HTTP server está rodando!')
  })
  .catch((error) => {
    console.error('❌ Erro ao iniciarlizar HTTP server:', error)
    process.exit(1)
  })
