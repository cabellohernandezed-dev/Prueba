import { PrismaClient } from '@prisma/client';

/**
 * Creamos una única instancia de Prisma para que toda la aplicación
 * utilice la misma conexión a PostgreSQL. Así evitamos crear conexiones
 * innecesarias y centralizamos el acceso a la base de datos mediante
 * los repositorios.
 */
export const prisma = new PrismaClient();
