import { Router } from 'express';
import { login, logout, me, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

/**
 * Repositorio de usuarios.
 *
 * Se encarga de realizar todas las consultas a la base de datos.
 * Así, si en el futuro cambiamos Prisma por otra herramienta,
 * solo tendremos que modificar este archivo sin afectar los servicios.
 */
export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, me);
