import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';

/**
 * Punto de entrada del backend: levanta el servidor HTTP.
 */
const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`API escuchando en http://localhost:${env.port}`);
});

/**
 * Cierre ordenado: al recibir SIGINT/SIGTERM (por ejemplo al parar el
 * contenedor) dejamos de aceptar peticiones y cerramos la conexión a la BD.
 */
function shutdown(signal) {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
