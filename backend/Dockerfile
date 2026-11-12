# =============================================================================
# Backend: API que se encarga de procesar las solicitudes y comunicarse
# con la base de datos. Está desarrollado con Node.js, Express y Prisma.
# =============================================================================
FROM node:20-alpine

# Prisma necesita OpenSSL para funcionar correctamente en Alpine.
RUN apk add --no-cache openssl

WORKDIR /app

# 1. Instala las dependencias del proyecto.
COPY package*.json ./
RUN npm ci

# 2. Configura Prisma y genera su cliente.
COPY prisma ./prisma
RUN npx prisma generate

# 3. Copia el resto de los archivos de la aplicación.
COPY . .

# También ajusta el formato del archivo de inicio y le da permisos
# para que pueda ejecutarse correctamente.
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

EXPOSE 4000

# Al iniciar el contenedor, prepara la base de datos,
# agrega los datos iniciales y finalmente inicia la API.
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
