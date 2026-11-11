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

/** Busca y pagina libros; search revisa título y autor. */
export async function listBooks(filters, userId) {
  const page = Number(filters.page ?? 1);
  const pageSize = Number(filters.pageSize ?? 10);

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError('La página debe ser un entero mayor que 0.', 400);
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new AppError('El tamaño de página debe estar entre 1 y 100.', 400);
  }

  const { books, total } = await bookRepository.findAll({
    search: String(filters.search ?? '').trim(),
    genre: String(filters.genre ?? '').trim(),
    page,
    pageSize,
    userId,
  });

  return {
    books,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function listGenres() {
  const genres = await bookRepository.findGenres();
  return genres.map(({ genero }) => genero);
}

/** Devuelve un libro por id o lanza 404 si no existe. */
export async function getBookById(id, userId) {
  const book = userId
    ? await bookRepository.findByIdForUser(id, userId)
    : await bookRepository.findById(id);

  if (!book) {
    throw new AppError('El libro no existe.', 404);
  }

  return book;
}

/** Cambia el estado de lectura personal de un usuario. */
export async function updateReadingStatus(bookId, userId, estado) {
  await getBookById(bookId);
  return bookRepository.saveReadingStatus(userId, bookId, estado);
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
