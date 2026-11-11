import * as bookService from '../services/book.service.js';
import { asyncHandler } from '../utils/async-handler.js';

/**
 * Controlador de libros (capa HTTP).
 * Traduce entre HTTP y el servicio; no contiene lógica de negocio.
 */

/** GET /api/books — lista todos los libros. */
export const list = asyncHandler(async (_req, res) => {
  const books = await bookService.listBooks();
  res.status(200).json({ books });
});

/** GET /api/books/:id — detalle de un libro. */
export const getById = asyncHandler(async (req, res) => {
  const book = await bookService.getBookById(req.params.id);
  res.status(200).json({ book });
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
