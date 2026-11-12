import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { bookRouter } from './routes/book.routes.js';

/**
 * Configuración de la aplicación Express.
 *
 * Aquí se prepara la aplicación y se configuran los elementos
 * necesarios para que funcione correctamente.
 *
 * El orden de ejecución es el siguiente:
 * 1. cors: permite la comunicación con el frontend.
 * 2. json: permite recibir datos en formato JSON.
 * 3. cookieParser: permite leer las cookies del navegador.
 * 4. rutas: define las direcciones de la API.
 * 5. 404: detecta las rutas que no existen.
 * 6. errores: se encarga de manejar los errores de la aplicación.
 *
 * Se mantiene separado del servidor para poder utilizarlo
 * en las pruebas sin necesidad de iniciar un puerto.
 */
export function createApp() {
  const app = express();

// `credentials: true` permite que el navegador envíe y reciba
// la cookie de sesión cuando el frontend se comunica con el backend.
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/auth', authRouter);
  app.use('/api/books', bookRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
