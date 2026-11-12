import { prisma } from '../config/prisma.js';

/**
 * Repositorio de libros.
 *
 * Se encarga de realizar las consultas a la base de datos utilizando
 * Prisma. Es la única parte del proyecto que accede directamente
 * a la base de datos para obtener, guardar, actualizar o eliminar libros.
 */

/** Busca el catálogo con filtros y el estado de lectura del usuario actual. */
export async function findAll({ search, genre, page, pageSize, userId }) {
  const where = {
    ...(genre ? { genero: genre } : {}),
    ...(search
      ? {
          OR: [
            { titulo: { contains: search, mode: 'insensitive' } },
            { autor: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        reading_progress: {
          where: { user_id: userId },
          select: { estado: true },
        },
      },
    }),
    prisma.book.count({ where }),
  ]);

  return {
    books: books.map(({ reading_progress, ...book }) => ({
      ...book,
      estado_lectura: reading_progress[0]?.estado ?? 'pendiente',
    })),
    total,
  };
}

/** Busca un libro por su id. Devuelve `null` si no existe. */
export function findById(id) {
  return prisma.book.findUnique({ where: { id } });
}

/** Devuelve un libro junto con el estado personal de lectura. */
export async function findByIdForUser(id, userId) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      reading_progress: {
        where: { user_id: userId },
        select: { estado: true },
      },
    },
  });

  if (!book) return null;
  const { reading_progress, ...data } = book;
  return {
    ...data,
    estado_lectura: reading_progress[0]?.estado ?? 'pendiente',
  };
}

/** Devuelve los géneros disponibles para el filtro del catálogo. */
export function findGenres() {
  return prisma.book.findMany({
    distinct: ['genero'],
    select: { genero: true },
    orderBy: { genero: 'asc' },
  });
}

/** Guarda o actualiza el estado de lectura del usuario para el libro. */
export function saveReadingStatus(userId, bookId, estado) {
  return prisma.readingProgress.upsert({
    where: { user_id_book_id: { user_id: userId, book_id: bookId } },
    create: { user_id: userId, book_id: bookId, estado },
    update: { estado },
  });
}

/** Busca un libro por su ISBN. Devuelve `null` si no existe. */
export function findByIsbn(isbn) {
  return prisma.book.findUnique({ where: { isbn } });
}

/** Crea un libro. */
export function create(data) {
  return prisma.book.create({ data });
}

/** Actualiza un libro existente. */
export function update(id, data) {
  return prisma.book.update({ where: { id }, data });
}

/** Elimina un libro. */
export function remove(id) {
  return prisma.book.delete({ where: { id } });
}
