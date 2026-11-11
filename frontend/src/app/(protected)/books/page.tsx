'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { DeleteBookButton } from '@/components/DeleteBookButton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { apiFetch } from '@/lib/api';
import type { Book } from '@/lib/types';

/** Listado de libros en una tabla, con acciones de ver, editar y eliminar. */
export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<{ books: Book[] }>('/books');
      setBooks(data.books);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Tras eliminar, quitamos el libro de la lista sin recargar toda la tabla.
  function handleDeleted(bookId: string) {
    setBooks((previous) => previous.filter((book) => book.id !== bookId));
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Libros</h1>
        <Link
          href="/books/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo libro
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <p className="text-gray-500">Cargando libros...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">Todavía no hay libros registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">ISBN</th>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Autor</th>
                <th className="px-4 py-3 font-medium">Género</th>
                <th className="px-4 py-3 font-medium">Año</th>
                <th className="px-4 py-3 font-medium">Páginas</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-700">{book.isbn}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{book.titulo}</td>
                  <td className="px-4 py-3 text-gray-700">{book.autor}</td>
                  <td className="px-4 py-3 text-gray-700">{book.genero}</td>
                  <td className="px-4 py-3 text-gray-700">{book.anio_publicacion}</td>
                  <td className="px-4 py-3 text-gray-700">{book.paginas}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/books/${book.id}`}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/books/${book.id}/edit`}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Editar
                      </Link>
                      <DeleteBookButton
                        bookId={book.id}
                        bookTitle={book.titulo}
                        onDeleted={() => handleDeleted(book.id)}
                        onError={setError}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
