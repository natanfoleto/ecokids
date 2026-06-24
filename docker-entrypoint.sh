#!/bin/sh
set -e

echo "Executando as migrations do banco de dados..."
pnpm prisma migrate deploy

echo "Iniciando a aplicação..."
exec node dist/http/server.js
