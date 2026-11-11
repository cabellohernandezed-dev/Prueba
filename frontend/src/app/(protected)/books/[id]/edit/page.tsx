'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BookForm } from '@/components/BookForm';
import type { BookFormValues } from '@/components/BookForm';
import { ErrorMessage } from '@/components/ErrorMessage';
import { apiFetch } from '@/lib/api';
import type { Book } from '@/lib/types';

/** Página para editar un libro existente (reutiliza el mismo formulario). */
export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
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

  async function handleUpdate(values: BookFormValues) {
    await apiFetch(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    });
    router.push(`/books/${id}`);
  }

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
      <Link href={`/books/${id}`} className="text-sm text-blue-600 hover:underline">
        ← Volver al detalle
      </Link>
      <h1 className="text-2xl font-bold">Editar libro</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <BookForm
          submitLabel="Guardar cambios"
          initialValues={{
            isbn: book.isbn,
            titulo: book.titulo,
            autor: book.autor,
            genero: book.genero,
            anio_publicacion: book.anio_publicacion,
            paginas: book.paginas,
            sinopsis: book.sinopsis ?? '',
          }}
          onSubmit={handleUpdate}
        />
      </div>
    </section>
  );
}
