/**
 * Cliente HTTP del frontend.
 *
 * Se encarga de realizar todas las peticiones al backend desde un solo lugar,
 * evitando repetir la dirección de la API y la configuración.
 *
 * También envía la cookie de sesión y muestra mensajes claros
 * cuando ocurre algún error en las peticiones.
 */

// Las peticiones se hacen al mismo origen del frontend y el servidor de Next.js
// las reenvía al backend mediante un proxy (ver next.config.mjs). Así la cookie
// de sesión es de primera parte y funciona aunque el backend esté en otro dominio.
const API_URL = '/api';

/** Error que incluye el código HTTP, útil para reaccionar a un 401, 404, etc. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Envía una petición al backend y devuelve la respuesta
 * en formato JSON.
 *
 * Si ocurre algún error, genera un `ApiError` con el mensaje
 * correspondiente.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    // Necesario para que el navegador envíe y guarde la cookie de sesión.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // 204 = "sin contenido" (por ejemplo al eliminar un libro).
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message ??
      'Ocurrió un error inesperado. Inténtalo de nuevo.';
    throw new ApiError(message, response.status);
  }

  return data as T;
}
