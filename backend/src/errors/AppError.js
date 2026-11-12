/**
 * Error de la aplicación.
 *
 * Se utiliza para indicar errores que pueden ocurrir durante el funcionamiento
 * del sistema, como un libro no encontrado (404), un ISBN duplicado (409)
 * o un usuario no autenticado (401).
 *
 * Incluye un código HTTP que permite identificar el tipo de error y enviar
 * una respuesta adecuada al usuario.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}
