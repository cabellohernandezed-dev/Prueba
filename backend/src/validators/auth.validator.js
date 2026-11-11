import { z } from 'zod';

/**
 * Esquemas de validación (Zod) de las peticiones de autenticación.
 *
 * Validar en el backend es obligatorio: nunca se debe confiar en los datos que
 * llegan del cliente. Si la validación falla, el middleware `validate` responde
 * con un error HTTP 400 y un mensaje claro.
 */

export const registerSchema = z.object({
  nombre: z
    .string({ message: 'El nombre es obligatorio.' })
    .trim()
    .min(1, 'El nombre es obligatorio.'),
  email: z.email('El email no es válido.'),
  password: z
    .string({ message: 'La contraseña es obligatoria.' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export const loginSchema = z.object({
  email: z.email('El email no es válido.'),
  password: z
    .string({ message: 'La contraseña es obligatoria.' })
    .min(1, 'La contraseña es obligatoria.'),
});
