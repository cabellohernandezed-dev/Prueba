import assert from 'node:assert/strict';
import test from 'node:test';

process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET = 'unit-test-secret-not-used-for-network';

const { requireRole } = await import('./auth.middleware.js');

test('requireRole rejects users without the required role with status 403', () => {
  let receivedError;

  requireRole('admin')(
    { user: { role: 'consulta' } },
    null,
    (error) => {
      receivedError = error;
    },
  );

  assert.equal(receivedError?.statusCode, 403);
});

test('requireRole continues when the user has an allowed role', () => {
  let nextCalled = false;

  requireRole('admin')({ user: { role: 'admin' } }, null, (error) => {
    assert.equal(error, undefined);
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});
