'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

/**
 * Diseño de las páginas protegidas.
 *
 * Mientras se verifica si el usuario ha iniciado sesión,
 * se espera antes de mostrar el contenido.
 * Si no hay una sesión activa, se redirige al usuario al inicio de sesión.
 * Si la sesión es válida, se muestra la cabecera y el contenido de la página.
 *
 * Todas las páginas dentro de `(protected)` utilizan esta configuración.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  if (isLoading) {
    return <p className="p-8 text-center text-gray-500">Cargando sesión...</p>;
  }

  // Sin usuario: el useEffect ya está redirigiendo; no renderizamos nada.
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link href="/books" className="text-lg font-semibold">
            Club de Lectura
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.nombre} ({user.role})
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </div>
  );
}
