import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError.js';
import * as userRepository from '../repositories/user.repository.js';

/**
 * Servicio de autenticación.
 *
 * Aquí se encuentra toda la lógica relacionada con el inicio de sesión
 * y el registro de usuarios, como encriptar contraseñas, verificar
 * credenciales y comprobar si un correo ya está registrado.
 *
 * No se encarga de recibir peticiones ni de consultar directamente
 * la base de datos, esas tareas corresponden a otras partes del proyecto.
 */

/** Número de rondas de bcrypt. Más rondas = más seguro, pero más lento. */
const BCRYPT_ROUNDS = 10;

/** Normaliza un email (sin espacios y en minúsculas) para compararlo de forma consistente. */
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

/** Devuelve solo los datos públicos del usuario (NUNCA el hash de la contraseña). */
function toPublicUser(user) {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    role: user.role,
  };
}

/**
 * Registra un usuario nuevo.
 * Lanza 409 si el email ya está en uso.
 */
export async function register({ nombre, email, password }) {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await userRepository.findByEmail(normalizedEmail);
  if (existingUser) {
    throw new AppError('Ya existe una cuenta registrada con ese email.', 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await userRepository.create({
    nombre: nombre.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return toPublicUser(user);
}

/**
 * Valida las credenciales de un usuario.
 * Lanza 401 si el email no existe o la contraseña es incorrecta.
 */
export async function login({ email, password }) {
  const user = await userRepository.findByEmail(normalizeEmail(email));

  // Por seguridad usamos el mismo mensaje en ambos casos: así no revelamos
  // a un atacante si el email existe o no.
  const invalidCredentialsError = new AppError(
    'Email o contraseña incorrectos.',
    401,
  );

  if (!user) {
    throw invalidCredentialsError;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw invalidCredentialsError;
  }

  return toPublicUser(user);
}

/**
 * Devuelve el usuario público por id, o `null` si ya no existe.
 * Se usa para validar la sesión actual (endpoint /me).
 */
export async function getPublicUserById(id) {
  const user = await userRepository.findById(id);
  return user ? toPublicUser(user) : null;
}
