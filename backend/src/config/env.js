import 'dotenv/config';

/**
 * Configuración centralizada del backend.
 *
 * Leemos las variables de entorno UNA sola vez y fallamos rápido si falta
 * alguna crítica. Así el resto del código nunca tiene que lidiar con valores
 * indefinidos ni dispersar process.env por todo el proyecto.
 */

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
};
