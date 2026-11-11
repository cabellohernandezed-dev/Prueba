import { PrismaClient } from '@prisma/client';

/**
 * Cliente único de Prisma (patrón singleton).
 *
 * Se exporta una instancia compartida para que toda la aplicación use la misma
 * conexión a PostgreSQL. El acceso a datos SIEMPRE pasa por aquí (a través de
 * los repositorios), nunca desde los controladores.
 */
export const prisma = new PrismaClient();
