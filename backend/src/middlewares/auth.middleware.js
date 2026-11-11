import { AppError } from '../errors/AppError.js';
import * as userRepository from '../repositories/user.repository.js';
import { AUTH_COOKIE_NAME, verifyToken } from '../utils/jwt.js';

/**
 * Middleware que protege las rutas privadas.
 *
 * Lee el JWT de la cookie httpOnly. Si no hay token, o es inválido/expirado,
 * responde con HTTP 401. Si es válido, deja los datos del usuario en
 * `req.user` para que los controladores puedan usarlos.
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
