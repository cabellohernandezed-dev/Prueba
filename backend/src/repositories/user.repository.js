import { prisma } from '../config/prisma.js';

/**
 * Repositorio de usuarios.
 *
 * Se encarga de realizar todas las consultas a la base de datos.
 * Así, si en el futuro cambiamos Prisma por otra herramienta,
 * solo tendremos que modificar este archivo sin afectar los servicios.
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
