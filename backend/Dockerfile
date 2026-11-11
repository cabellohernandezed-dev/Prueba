# =============================================================================
# Backend — API REST (Express + Prisma) sobre Node.js
# =============================================================================
FROM node:20-alpine

# Prisma necesita OpenSSL en Alpine para sus binarios de motor.
RUN apk add --no-cache openssl

WORKDIR /app

# 1) Dependencias (esta capa se cachea mientras no cambie package.json/lock)
COPY package*.json ./
RUN npm ci

# 2) Esquema de Prisma + generación del cliente tipado
COPY prisma ./prisma
RUN npx prisma generate

# 3) Resto del código de la aplicación
COPY . .

# Normaliza los finales de línea del entrypoint (editado en Windows) y da permisos
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

EXPOSE 4000

# Al arrancar: aplica migraciones, ejecuta el seed y levanta la API.
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
