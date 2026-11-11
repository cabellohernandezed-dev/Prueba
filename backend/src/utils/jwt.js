import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/** Nombre de la cookie httpOnly donde viaja el token. */
export const AUTH_COOKIE_NAME = 'token';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Opciones base de la cookie de autenticación.
 *
 * - httpOnly: JavaScript del navegador NO puede leerla -> mitigamos XSS.
 * - sameSite 'lax': la cookie viaja en peticiones del mismo sitio.
 * - secure: se deja en false porque el entorno local corre sobre HTTP. En un
 *   despliegue real con HTTPS debería activarse (true).
 */
function baseCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  };
}

/** Opciones para *escribir* la cookie (añade caducidad de 1 día). */
export function authCookieOptions() {
  return { ...baseCookieOptions(), maxAge: ONE_DAY_IN_MS };
}

/** Firma un JWT con los datos mínimos del usuario. */
export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

/** Verifica y decodifica un JWT. Lanza si el token es inválido o expiró. */
export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

/** Borra la cookie de autenticación (logout). */
export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, baseCookieOptions());
}
