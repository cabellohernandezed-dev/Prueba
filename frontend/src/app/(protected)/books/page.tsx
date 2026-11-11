'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { DeleteBookButton } from '@/components/DeleteBookButton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api';
import type { Book, ReadingStatus } from '@/lib/types';

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/** Listado de libros en una tabla, con acciones de ver, editar y eliminar. */
export default function BooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '10',
      });
      if (search) params.set('search', search);
      if (genre) params.set('genre', genre);
      const data = await apiFetch<{ books: Book[]; pagination: Pagination }>(
        `/books?${params.toString()}`,
      );
      setBooks(data.books);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, [genre, page, search]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    apiFetch<{ genres: string[] }>('/books/genres')
      .then((data) => setGenres(data.genres))
      .catch(() => setGenres([]));
  }, []);

  // Tras eliminar, quitamos el libro de la lista sin recargar toda la tabla.
  function handleDeleted(bookId: string) {
    if (books.length === 1 && page > 1) {
      setPage((current) => current - 1);
    } else {
      setBooks((previous) => previous.filter((book) => book.id !== bookId));
    }
    setPagination((previous) => ({
      ...previous,
      total: Math.max(0, previous.total - 1),
    }));
  }

  async function handleReadingStatusChange(bookId: string, estado: ReadingStatus) {
    try {
      await apiFetch(`/books/${bookId}/reading-status`, {
        method: 'PATCH',
        body: JSON.stringify({ estado }),
      });
      setBooks((previous) =>
        previous.map((book) =>
          book.id === bookId ? { ...book, estado_lectura: estado } : book,
        ),
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el estado.');
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Libros</h1>
        {user?.role === 'admin' && (
          <Link
            href="/books/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nuevo libro
          </Link>
        )}
      </div>

      <form
        className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setSearch(searchInput.trim());
        }}
      >
        <label className="sr-only" htmlFor="book-search">Buscar por título o autor</label>
        <input
          id="book-search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar por título o autor"
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <label className="sr-only" htmlFor="book-genre">Filtrar por género</label>
        <select
          id="book-genre"
          value={genre}
          onChange={(event) => {
            setGenre(event.target.value);
            setPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Todos los géneros</option>
          {genres.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button
          type="submit"
          className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Buscar
        </button>
      </form>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <p className="text-gray-500">Cargando libros...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">No se encontraron libros con esos filtros.</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">Resultados: {pagination.total}</p>
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
                  <th className="px-4 py-3 font-medium">Lectura</th>
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
                      <label className="sr-only" htmlFor={`reading-${book.id}`}>Estado de lectura de {book.titulo}</label>
                      <select
                        id={`reading-${book.id}`}
                        value={book.estado_lectura}
                        onChange={(event) =>
                          handleReadingStatusChange(book.id, event.target.value as ReadingStatus)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1.5"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="leyendo">Leyendo</option>
                        <option value="leído">Leído</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/books/${book.id}`}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Ver
                        </Link>
                        {user?.role === 'admin' && (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {pagination.page} de {Math.max(1, pagination.totalPages)}
            </span>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}
