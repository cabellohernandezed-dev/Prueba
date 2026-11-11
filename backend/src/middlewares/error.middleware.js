import { AppError } from '../errors/AppError.js';

/**
 * Middleware de errores centralizado.
 *
 * Express envía aquí cualquier error lanzado en controladores o servicios.
 * - Si es un `AppError` (error de negocio) responde con su código HTTP y su mensaje.
 * - Cualquier otro error es inesperado: se registra en consola y se responde 500.
 *
 * Debe declararse SIEMPRE al final, después de todas las rutas.
 */
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error('Error no controlado:', err);
  return res.status(500).json({ message: 'Error interno del servidor.' });
}
