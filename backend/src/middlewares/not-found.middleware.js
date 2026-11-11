import { AppError } from '../errors/AppError.js';

/**
 * Middleware para rutas no definidas.
 *
 * Si una petición no coincide con ninguna ruta registrada, se responde 404
 * con un mensaje claro en lugar de dejar la petición colgada.
 */
export function notFoundHandler(req, _res, next) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
}
