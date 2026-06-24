#!/bin/sh
set -e

echo "Executando as migrations do banco de dados..."
./node_modules/.bin/prisma migrate deploy

echo "Iniciando a aplicação..."
exec node dist/http/server.js
