import assert from 'node:assert/strict';
import test from 'node:test';
import { bookSchema, readingStatusSchema } from './book.validator.js';

test('bookSchema trims text and converts numeric fields', () => {
  const result = bookSchema.safeParse({
    isbn: '  978-0-123456-47-2  ',
    titulo: '  El principito  ',
    autor: '  Antoine de Saint-Exupéry  ',
    genero: '  Ficción  ',
    anio_publicacion: String(new Date().getFullYear()),
    paginas: '96',
    sinopsis: '  Una historia breve.  ',
  });

  assert.equal(result.success, true);
  assert.equal(result.data.isbn, '978-0-123456-47-2');
  assert.equal(result.data.titulo, 'El principito');
  assert.equal(result.data.anio_publicacion, new Date().getFullYear());
  assert.equal(result.data.paginas, 96);
  assert.equal(result.data.sinopsis, 'Una historia breve.');
});

test('bookSchema rejects a future year and a non-positive page count', () => {
  const result = bookSchema.safeParse({
    isbn: '978-0-123456-47-2',
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    genero: 'Ficción',
    anio_publicacion: new Date().getFullYear() + 1,
    paginas: 0,
  });

  assert.equal(result.success, false);
  const invalidFields = result.error.issues.map((issue) => issue.path[0]);
  assert.ok(invalidFields.includes('anio_publicacion'));
  assert.ok(invalidFields.includes('paginas'));
});

test('readingStatusSchema only accepts the supported reading states', () => {
  for (const estado of ['pendiente', 'leyendo', 'leído']) {
    assert.equal(readingStatusSchema.safeParse({ estado }).success, true);
  }

  assert.equal(
    readingStatusSchema.safeParse({ estado: 'terminado' }).success,
    false,
  );
});
