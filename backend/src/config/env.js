import 'dotenv/config';

/**
 * Configuración centralizada del backend.
 *
 * Leemos las variables de entorno al iniciar el programa y verificamos que 
 * las necesarias estén configuradas. Si falta alguna, mostramos un error desde el principio. Así evitamos problemas con 
 * valores vacíos o indefinidos en el resto del proyecto.
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
