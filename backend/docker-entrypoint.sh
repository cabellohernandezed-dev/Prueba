#!/bin/sh
# -----------------------------------------------------------------------------
# Punto de entrada del contenedor del backend.
# Se ejecuta al arrancar el contenedor y deja la base de datos lista antes de
# levantar la API. El seed es idempotente, por lo que es seguro ejecutarlo
# en cada arranque.
# -----------------------------------------------------------------------------
set -e

echo "Migraciones: aplicando migraciones pendientes de la base de datos..."
npx prisma migrate deploy

echo "Seed: cargando usuario y libros de prueba..."
npx prisma db seed

echo "API: iniciando servidor en el puerto ${PORT:-4000}..."
exec node src/server.js
