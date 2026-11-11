import { AppError } from '../errors/AppError.js';
import * as bookRepository from '../repositories/book.repository.js';

/**
 * Servicio de libros (capa de lógica de negocio).
 *
 * Reglas implementadas:
 *  - El ISBN es único: si ya existe, se responde 409.
 *  - Un libro inexistente no se puede consultar, editar ni borrar: 404.
 *  - La sinopsis vacía se guarda como `null`.
 */

/**
 * Toma solo los campos permitidos del libro y normaliza la sinopsis.
 * Así evitamos "mass assignment" (que el cliente envíe campos que no debe).
 */
function toBookData(input) {
  return {
    isbn: input.isbn,
    titulo: input.titulo,
    autor: input.autor,
    genero: input.genero,
    anio_publicacion: input.anio_publicacion,
    paginas: input.paginas,
    sinopsis: input.sinopsis ? input.sinopsis : null,
  };
}

/** Lista todos los libros. */
export function listBooks() {
  return bookRepository.findAll();
}

/** Devuelve un libro por id o lanza 404 si no existe. */
export async function getBookById(id) {
  const book = await bookRepository.findById(id);

  if (!book) {
    throw new AppError('El libro no existe.', 404);
  }

  return book;
}

/** Crea un libro validando que el ISBN no esté repetido (409). */
export async function createBook(input) {
  const existingBook = await bookRepository.findByIsbn(input.isbn);

  if (existingBook) {
    throw new AppError('Ya existe un libro con ese ISBN.', 409);
  }

  return bookRepository.create(toBookData(input));
}

/** Actualiza un libro validando que exista (404) y que el ISBN no choque (409). */
export async function updateBook(id, input) {
  // Reutilizamos getBookById para el 404.
  await getBookById(id);

  const bookWithSameIsbn = await bookRepository.findByIsbn(input.isbn);
  if (bookWithSameIsbn && bookWithSameIsbn.id !== id) {
    throw new AppError('Ya existe otro libro con ese ISBN.', 409);
  }

  return bookRepository.update(id, toBookData(input));
}

/** Elimina un libro validando que exista (404). */
export async function deleteBook(id) {
  await getBookById(id);
  await bookRepository.remove(id);
}
