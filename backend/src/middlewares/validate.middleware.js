import { AppError } from '../errors/AppError.js';

/**
 * Middleware genérico de validación.
 *
 * Recibe un esquema de Zod y comprueba `req.body`. Si los datos son válidos,
 * sustituye `req.body` por los datos ya validados/normalizados y continúa.
 * Si no, corta la petición con un error 400 y el primer mensaje de error
 * (pensado para mostrarse tal cual al usuario en el frontend).
 */
export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Datos inválidos.';
      return next(new AppError(message, 400));
    }

    req.body = result.data;
    next();
  };
}
