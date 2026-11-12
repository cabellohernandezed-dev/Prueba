import { AppError } from '../errors/AppError.js';

/**
 * Middleware para validar los datos recibidos.
 *
 * Utiliza un esquema de Zod para comprobar que los datos enviados
 * sean correctos. Si todo está bien, guarda los datos validados
 * y continúa con la petición.
 *
 * Si encuentra algún error, detiene la petición y devuelve un
 * mensaje indicando qué dato es incorrecto.
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
