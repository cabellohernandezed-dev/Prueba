import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  clearAuthCookie,
  signToken,
} from '../utils/jwt.js';

/**
 * Controlador de autenticación (capa HTTP).
 *
 * Su trabajo es traducir entre HTTP y el servicio: leer datos de `req`, llamar
 * al servicio y construir la respuesta. La lógica de negocio NO vive aquí.
 *
 * `asyncHandler` captura cualquier error async y lo envía al middleware de
 * errores, para no repetir `try/catch` en cada función.
 */

/** Escribe la cookie con el token del usuario y responde con sus datos públicos. */
function sendSession(res, user, statusCode) {
  const token = signToken({ sub: user.id, email: user.email });
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
  return res.status(statusCode).json({ user });
}

/** POST /api/auth/register — crea la cuenta e inicia sesión. */
export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  sendSession(res, user, 201);
});

/** POST /api/auth/login — valida credenciales e inicia sesión. */
export const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);
  sendSession(res, user, 200);
});

/** POST /api/auth/logout — elimina la cookie de sesión. */
export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: 'Sesión cerrada correctamente.' });
});

/** GET /api/auth/me — devuelve el usuario de la sesión actual (ruta protegida). */
export const me = asyncHandler(async (req, res) => {
  const user = await authService.getPublicUserById(req.user.id);

  // El token era válido, pero el usuario ya no existe: cerramos la sesión.
  if (!user) {
    clearAuthCookie(res);
    return res.status(401).json({ message: 'Sesión inválida.' });
  }

  res.status(200).json({ user });
});
