import { AppError } from '../errors/AppError.js';
import * as userRepository from '../repositories/user.repository.js';
import { AUTH_COOKIE_NAME, verifyToken } from '../utils/jwt.js';

/**
 * Middleware que protege las rutas privadas.
 *
 * Verifica que el usuario tenga un token válido para acceder.
 * Si no tiene token o este ha expirado, bloquea el acceso.
 * Si el token es válido, guarda los datos del usuario en `req.user`
 * para que puedan utilizarse en el resto de la aplicación.
 */
export async function requireAuth(req, _res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return next(
      new AppError('No autenticado. Inicia sesión para continuar.', 401),
    );
  }

  try {
    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      return next(
        new AppError('Sesión inválida o expirada. Inicia sesión de nuevo.', 401),
      );
    }
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch {
    next(
      new AppError('Sesión inválida o expirada. Inicia sesión de nuevo.', 401),
    );
  }
}

/** Limita una ruta a usuarios con alguno de los roles indicados. */
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError('No tienes permisos para realizar esta acción.', 403),
      );
    }
    next();
  };
}
