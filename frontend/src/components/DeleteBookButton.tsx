'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

type DeleteBookButtonProps = {
  bookId: string;
  bookTitle: string;
  /** Se llama tras eliminar el libro correctamente. */
  onDeleted: () => void;
  /** Permite a la página mostrar el error donde prefiera. */
  onError: (message: string) => void;
};

/**
 * Botón de eliminar libro con confirmación previa.
 * Reutilizable tanto en el listado como en el detalle.
 */
export function DeleteBookButton({
  bookId,
  bookTitle,
  onDeleted,
  onError,
}: DeleteBookButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Eliminar el libro "${bookTitle}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    try {
      await apiFetch(`/books/${bookId}`, { method: 'DELETE' });
      onDeleted();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error inesperado.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {isDeleting ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}
