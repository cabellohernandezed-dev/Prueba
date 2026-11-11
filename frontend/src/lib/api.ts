/**
 * Cliente HTTP del frontend.
 *
 * Centraliza TODAS las llamadas a la API del backend para no repetir la URL
 * base ni la configuración de las peticiones. Además:
 *  - envía la cookie de sesión (`credentials: 'include'`),
 *  - convierte las respuestas de error en excepciones con mensaje legible.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

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
 * Realiza una petición a la API y devuelve el JSON ya parseado.
 * Lanza `ApiError` si la respuesta no es correcta.
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
