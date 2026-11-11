/**
 * Error de aplicación.
 *
 * Representa un error "esperado" (de negocio) con un código HTTP asociado, por
 * ejemplo: 404 libro no encontrado, 409 ISBN duplicado, 401 no autenticado.
 * El middleware de errores sabe leer `statusCode` y responder de forma
 * consistente.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}
