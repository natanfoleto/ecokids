FROM node:22-alpine

WORKDIR /app

# dependências do prisma
RUN apk add --no-cache openssl

# pnpm
RUN npm install -g pnpm@9.15.1

# copia o monorepo inteiro
COPY . .

# instala dependências workspace
RUN pnpm install --frozen-lockfile

# gera prisma client
RUN pnpm --filter @ecokids/api prisma generate

# build somente da api
RUN pnpm --filter @ecokids/api build

# entrar na api
WORKDIR /app/apps/api

# entrypoint
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3333

ENTRYPOINT ["./docker-entrypoint.sh"]