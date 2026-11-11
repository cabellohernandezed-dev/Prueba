import { Router } from 'express';
import {
  create,
  getById,
  list,
  remove,
  update,
} from '../controllers/book.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { bookSchema } from '../validators/book.validator.js';

/**
 * Rutas de libros (prefijo /api/books).
 *
 * TODAS las rutas están protegidas con `requireAuth`: si no hay sesión válida,
 * se responde 401 antes de llegar al controlador.
 */
export const bookRouter = Router();

bookRouter.use(requireAuth);

bookRouter.get('/', list);
bookRouter.get('/:id', getById);
bookRouter.post('/', validate(bookSchema), create);
bookRouter.put('/:id', validate(bookSchema), update);
bookRouter.delete('/:id', remove);
