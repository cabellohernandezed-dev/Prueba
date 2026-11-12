# =============================================================================
# Frontend: aplicación web desarrollada con Next.js.
# Utiliza el sistema App Router para organizar las páginas y rutas.
# Se compila en modo "standalone" para facilitar su ejecución con Docker.
# =============================================================================

# 1) Dependencias 
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Compilación 
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# La URL de la API se incrusta en el bundle durante la compilación.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) Runtime (imagen final mínima) 
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Ejecutamos como usuario sin privilegios.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
