import { Router } from 'express';
import {
  create,
  getById,
  list,
  listGenres,
  remove,
  update,
  updateReadingStatus,
} from '../controllers/book.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  bookSchema,
  readingStatusSchema,
} from '../validators/book.validator.js';

/**
 * Rutas de libros.
 *
 * Aquí se definen las direcciones para realizar las operaciones
 * relacionadas con los libros. Todas requieren que el usuario
 * haya iniciado sesión para poder acceder.
 */
export const bookRouter = Router();

bookRouter.use(requireAuth);

bookRouter.get('/', list);
bookRouter.get('/genres', listGenres);
bookRouter.patch(
  '/:id/reading-status',
  validate(readingStatusSchema),
  updateReadingStatus,
);
bookRouter.get('/:id', getById);
bookRouter.post('/', requireRole('admin'), validate(bookSchema), create);
bookRouter.put('/:id', requireRole('admin'), validate(bookSchema), update);
bookRouter.delete('/:id', requireRole('admin'), remove);
