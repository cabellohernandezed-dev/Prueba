'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAuth } from '@/context/auth-context';

/** Página de registro de usuario. */
export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register(nombre, email, password);
      router.push('/books');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-4">
      <h1 className="mb-6 text-2xl font-bold">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} />}

        <div>
          <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none';
