#!/bin/sh
set -e

echo "Executando as migrations do banco de dados..."

pnpm prisma migrate deploy

node dist/http/server.js