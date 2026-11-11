'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookForm } from '@/components/BookForm';
import type { BookFormValues } from '@/components/BookForm';
import { apiFetch } from '@/lib/api';

/** Página para crear un libro nuevo. */
export default function NewBookPage() {
  const router = useRouter();

  async function handleCreate(values: BookFormValues) {
    await apiFetch('/books', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    router.push('/books');
  }

  return (
    <section className="space-y-4">
      <Link href="/books" className="text-sm text-blue-600 hover:underline">
        ← Volver al listado
      </Link>
      <h1 className="text-2xl font-bold">Nuevo libro</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <BookForm submitLabel="Crear libro" onSubmit={handleCreate} />
      </div>
    </section>
  );
}
