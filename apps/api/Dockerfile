FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl
RUN npm install -g pnpm@9.15.1

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @ecokids/api prisma generate
RUN pnpm --filter @ecokids/api build

WORKDIR /app/apps/api

RUN chmod +x docker-entrypoint.sh

EXPOSE 3333

ENTRYPOINT ["./docker-entrypoint.sh"]