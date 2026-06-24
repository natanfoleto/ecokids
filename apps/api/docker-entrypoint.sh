#!/bin/sh
set -e

echo "Executando as migrations do banco de dados..."

pnpm prisma migrate deploy
pnpm prisma generate

node dist/http/server.js