import { AppError } from '../errors/AppError.js';

/**
 * Middleware para rutas no encontradas.
 *
 * Se encarga de detectar cuando un usuario intenta acceder a una ruta
 * que no existe y devuelve un error 404 con un mensaje indicando
 * que la dirección solicitada no está disponible.
 */
export function notFoundHandler(req, _res, next) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
}
