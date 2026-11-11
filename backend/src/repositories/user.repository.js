import { prisma } from '../config/prisma.js';

/**
 * Repositorio de usuarios (capa de acceso a datos).
 *
 * Es la ÚNICA capa que habla con la base de datos. Así, si mañana cambiamos
 * Prisma por otro ORM, solo hay que tocar este archivo: los servicios no se
 * enteran.
 */

/** Busca un usuario por su email. Devuelve `null` si no existe. */
export function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

/** Busca un usuario por su id. Devuelve `null` si no existe. */
export function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

/** Crea un usuario. Recibe el hash de la contraseña (nunca la contraseña en claro). */
export function create({ nombre, email, passwordHash }) {
  return prisma.user.create({
    data: { nombre, email, password_hash: passwordHash },
  });
}
