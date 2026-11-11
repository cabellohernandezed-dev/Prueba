import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { authRouter } from './routes/auth.routes.js';

/**
 * Fábrica de la aplicación Express.
 *
 * Se separa en su propio módulo (en lugar de crear el servidor directamente)
 * para poder importarla en pruebas sin abrir un puerto.
 *
 * El ORDEN de los middlewares es importante:
 *   1. cors        -> permite peticiones desde el frontend (y comparte cookies).
 *   2. json        -> parsea el cuerpo JSON de las peticiones.
 *   3. cookieParser-> parsea las cookies (de aquí sale el token de sesión).
 *   4. rutas       -> endpoints de la API.
 *   5. 404         -> rutas no encontradas.
 *   6. errores     -> SIEMPRE al final.
 */
export function createApp() {
  const app = express();

  // `credentials: true` es necesario para que el navegador envíe/guarde la
  // cookie de sesión en peticiones desde otro origen (el frontend).
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
