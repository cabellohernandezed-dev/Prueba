'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

/**
 * Layout de las rutas protegidas.
 *
 * Mientras `isLoading` es true esperamos a saber si hay sesión. Si no la hay,
 * redirigimos a /login. Si la hay, mostramos la cabecera y el contenido.
 * (Todas las páginas del grupo `(protected)` pasan por aquí.)
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
            <span className="text-sm text-gray-600">{user.nombre}</span>
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
