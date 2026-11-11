/**
 * Envuelve un controlador async para que cualquier error que lance sea enviado
 * a `next()`. Sin esto, un `await` que falla dentro de un handler de Express 4
 * no llega al middleware de errores y la petición queda colgada.
 */
export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
