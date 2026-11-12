import { AppError } from '../errors/AppError.js';

/**
 * Middleware para manejar todos los errores de la aplicación.
 *
 * Recibe los errores que ocurren en los controladores o servicios.
 * Si el error es conocido, responde con su código y mensaje correspondiente.
 * Si es un error inesperado, lo muestra en consola y responde con un error 500.
 *
 * Debe colocarse al final, después de todas las rutas.
 */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error('Error no controlado:', err);
  return res.status(500).json({ message: 'Error interno del servidor.' });
}
