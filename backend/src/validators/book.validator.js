import { z } from 'zod';

/**
 * Esquema de validación (Zod) del cuerpo de un libro.
 *
 * Se usa tanto para CREAR como para EDITAR porque el formulario del frontend
 * es el mismo en ambos casos (formulario compartido).
 */

// Año máximo permitido: el año actual. Un libro no puede publicarse en el futuro.
const currentYear = new Date().getFullYear();

export const bookSchema = z.object({
  isbn: z.string().trim().min(1, 'El ISBN es obligatorio.'),
  titulo: z.string().trim().min(1, 'El título es obligatorio.'),
  autor: z.string().trim().min(1, 'El autor es obligatorio.'),
  genero: z.string().trim().min(1, 'El género es obligatorio.'),
  anio_publicacion: z.coerce
    .number({ message: 'El año de publicación debe ser un número.' })
    .int('El año de publicación debe ser un número entero.')
    .min(1, 'El año de publicación no es válido.')
    .max(
      currentYear,
      `El año de publicación no puede ser mayor que ${currentYear}.`,
    ),
  paginas: z.coerce
    .number({ message: 'El número de páginas debe ser un número.' })
    .int('El número de páginas debe ser un número entero.')
    .positive('El número de páginas debe ser mayor que 0.'),
  sinopsis: z
    .string()
    .trim()
    .max(2000, 'La sinopsis no puede superar los 2000 caracteres.')
    .optional(),
});

export const readingStatusSchema = z.object({
  estado: z.enum(
    ['pendiente', 'leyendo', 'leído'],
    'El estado debe ser pendiente, leyendo o leído.',
  ),
});
