#!/bin/sh
# -----------------------------------------------------------------------------
# Archivo que se ejecuta cuando inicia el contenedor del backend.
# Primero prepara la base de datos y después inicia la API.
# También ejecuta el seed para agregar los datos iniciales.
# Puede ejecutarse cada vez que inicia el contenedor sin duplicar los datos.
# -----------------------------------------------------------------------------
set -e

echo "Migraciones: aplicando migraciones pendientes de la base de datos..."
npx prisma migrate deploy

echo "Seed: cargando usuario y libros de prueba..."
npx prisma db seed

echo "API: iniciando servidor en el puerto ${PORT:-4000}..."
exec node src/server.js
