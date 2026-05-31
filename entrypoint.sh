#!/bin/sh
set -e

echo "Running Prisma db push..."
prisma db push --url "$DATABASE_URL" --schema prisma/schema.prisma

echo "Starting Next.js server..."
exec node server.js
