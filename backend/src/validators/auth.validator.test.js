import assert from 'node:assert/strict';
import test from 'node:test';
import { loginSchema, registerSchema } from './auth.validator.js';

test('registerSchema accepts a valid user and trims the name', () => {
  const result = registerSchema.safeParse({
    nombre: '  Ana Pérez  ',
    email: 'ana@example.com',
    password: 'lectura123',
  });

  assert.equal(result.success, true);
  assert.equal(result.data.nombre, 'Ana Pérez');
});

test('registerSchema rejects invalid email and short passwords', () => {
  const result = registerSchema.safeParse({
    nombre: 'Ana',
    email: 'correo-invalido',
    password: 'corta',
  });

  assert.equal(result.success, false);
  assert.deepEqual(
    result.error.issues.map((issue) => issue.path[0]),
    ['email', 'password'],
  );
});

test('loginSchema requires a valid email and a non-empty password', () => {
  const result = loginSchema.safeParse({
    email: 'correo-invalido',
    password: '',
  });

  assert.equal(result.success, false);
  assert.deepEqual(
    result.error.issues.map((issue) => issue.path[0]),
    ['email', 'password'],
  );
});
