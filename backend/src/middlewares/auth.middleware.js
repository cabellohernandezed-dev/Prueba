import { AppError } from '../errors/AppError.js';
import { AUTH_COOKIE_NAME, verifyToken } from '../utils/jwt.js';

/**
 * Middleware que protege las rutas privadas.
 *
 * Lee el JWT de la cookie httpOnly. Si no hay token, o es inválido/expirado,
 * responde con HTTP 401. Si es válido, deja los datos del usuario en
 * `req.user` para que los controladores puedan usarlos.
 */
export function requireAuth(req, _res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return next(
      new AppError('No autenticado. Inicia sesión para continuar.', 401),
    );
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(
      new AppError('Sesión inválida o expirada. Inicia sesión de nuevo.', 401),
    );
  }
}
