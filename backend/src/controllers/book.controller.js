import * as bookService from '../services/book.service.js';
import { asyncHandler } from '../utils/async-handler.js';

/**
 * Controlador de libros.
 *
 * Se encarga de recibir las solicitudes, enviar los datos al servicio
 * correspondiente y devolver la respuesta. La lógica del funcionamiento
 * de los libros se encuentra en los servicios.
 */

/** GET /api/books — lista todos los libros. */
export const list = asyncHandler(async (req, res) => {
  const result = await bookService.listBooks(req.query, req.user.id);
  res.status(200).json(result);
});

/** GET /api/books/genres — géneros disponibles para el filtro. */
export const listGenres = asyncHandler(async (_req, res) => {
  const genres = await bookService.listGenres();
  res.status(200).json({ genres });
});

/** GET /api/books/:id — detalle de un libro. */
export const getById = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.id, req.user.id);
  res.status(200).json({ book });
});

/** PATCH /api/books/:id/reading-status — actualiza el estado personal. */
export const updateReadingStatus = asyncHandler(async (req, res) => {
  const progress = await bookService.updateReadingStatus(
    req.params.id,
    req.user.id,
    req.body.estado,
  );
  res.status(200).json({ readingProgress: progress });
});

/** POST /api/books — crea un libro. */
export const create = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body);
  res.status(201).json({ book });
});

/** PUT /api/books/:id — actualiza un libro. */
export const update = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.body);
  res.status(200).json({ book });
});

/** DELETE /api/books/:id — elimina un libro. */
export const remove = asyncHandler(async (req, res) => {
  await bookService.deleteBook(req.params.id);
  res.status(204).send();
});
