'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DeleteBookButton } from '@/components/DeleteBookButton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api';
import type { Book } from '@/lib/types';

/** Página de detalle de un libro. */
export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBook = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<{ book: Book }>(`/books/${id}`);
      setBook(data.book);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  if (isLoading) {
    return <p className="text-gray-500">Cargando libro...</p>;
  }

  if (error || !book) {
    return (
      <section className="space-y-4">
        <Link href="/books" className="text-sm text-blue-600 hover:underline">
          ← Volver al listado
        </Link>
        <ErrorMessage message={error ?? 'El libro no existe.'} />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Link href="/books" className="text-sm text-blue-600 hover:underline">
        ← Volver al listado
      </Link>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{book.titulo}</h1>
        {user?.role === 'admin' && (
          <div className="flex items-center gap-2">
            <Link
              href={`/books/${book.id}/edit`}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Editar
            </Link>
            <DeleteBookButton
              bookId={book.id}
              bookTitle={book.titulo}
              onDeleted={() => router.push('/books')}
              onError={setError}
            />
          </div>
        )}
      </div>

      <dl className="grid gap-4 rounded-lg border border-gray-200 bg-white p-6 sm:grid-cols-2">
        <Detail label="ISBN" value={book.isbn} />
        <Detail label="Autor" value={book.autor} />
        <Detail label="Género" value={book.genero} />
        <Detail label="Año de publicación" value={String(book.anio_publicacion)} />
        <Detail label="Páginas" value={String(book.paginas)} />
        <Detail label="Estado de lectura" value={book.estado_lectura} />
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">Sinopsis</dt>
          <dd className="mt-1 text-gray-900">
            {book.sinopsis ?? 'Sin sinopsis.'}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-gray-900">{value}</dd>
    </div>
  );
}
