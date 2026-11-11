import { prisma } from '../config/prisma.js';

/**
 * Repositorio de libros (capa de acceso a datos).
 *
 * Única capa que consulta la base de datos con Prisma.
 */

/** Devuelve todos los libros, del más reciente al más antiguo. */
export function findAll() {
  return prisma.book.findMany({ orderBy: { created_at: 'desc' } });
}

/** Busca un libro por su id. Devuelve `null` si no existe. */
export function findById(id) {
  return prisma.book.findUnique({ where: { id } });
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
