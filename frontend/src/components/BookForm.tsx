'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { ErrorMessage } from '@/components/ErrorMessage';

/**
 * Datos que se envían al guardar el formulario.
 *
 * Los campos `anio_publicacion` y `paginas` ya están
 * convertidos a números para evitar errores al procesarlos.
 */
export type BookFormValues = {
  isbn: string;
  titulo: string;
  autor: string;
  genero: string;
  anio_publicacion: number;
  paginas: number;
  sinopsis: string;
};

type BookFormProps = {
  /** Valores iniciales (solo se usa al EDITAR un libro). */
  initialValues?: Partial<BookFormValues>;
  /** Texto del botón: "Crear libro" o "Guardar cambios". */
  submitLabel: string;
  /** Se ejecuta al enviar. Si lanza un error, el mensaje se muestra en pantalla. */
  onSubmit: (values: BookFormValues) => Promise<void>;
};

/**
 * Formulario COMPARTIDO para crear y editar libros.
 * Los campos son los mismos en ambos casos, así que no tiene sentido duplicar
 * el formulario: la diferencia es solo el texto del botón y los valores
 * iniciales.
 */
export function BookForm({ initialValues, submitLabel, onSubmit }: BookFormProps) {
  // Guardamos los campos de texto como string (es lo natural para un input).
  const [values, setValues] = useState({
    isbn: initialValues?.isbn ?? '',
    titulo: initialValues?.titulo ?? '',
    autor: initialValues?.autor ?? '',
    genero: initialValues?.genero ?? '',
    anio_publicacion: initialValues?.anio_publicacion?.toString() ?? '',
    paginas: initialValues?.paginas?.toString() ?? '',
    sinopsis: initialValues?.sinopsis ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof typeof values, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        isbn: values.isbn.trim(),
        titulo: values.titulo.trim(),
        autor: values.autor.trim(),
        genero: values.genero.trim(),
        anio_publicacion: Number(values.anio_publicacion),
        paginas: Number(values.paginas),
        sinopsis: values.sinopsis.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="ISBN" htmlFor="isbn">
          <input
            id="isbn"
            value={values.isbn}
            onChange={(event) => handleChange('isbn', event.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Título" htmlFor="titulo">
          <input
            id="titulo"
            value={values.titulo}
            onChange={(event) => handleChange('titulo', event.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Autor" htmlFor="autor">
          <input
            id="autor"
            value={values.autor}
            onChange={(event) => handleChange('autor', event.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Género" htmlFor="genero">
          <input
            id="genero"
            value={values.genero}
            onChange={(event) => handleChange('genero', event.target.value)}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Año de publicación" htmlFor="anio_publicacion">
          <input
            id="anio_publicacion"
            type="number"
            min="1"
            value={values.anio_publicacion}
            onChange={(event) =>
              handleChange('anio_publicacion', event.target.value)
            }
            required
            className={inputClass}
          />
        </Field>

        <Field label="Páginas" htmlFor="paginas">
          <input
            id="paginas"
            type="number"
            min="1"
            value={values.paginas}
            onChange={(event) => handleChange('paginas', event.target.value)}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Sinopsis (opcional)" htmlFor="sinopsis">
        <textarea
          id="sinopsis"
          rows={4}
          value={values.sinopsis}
          onChange={(event) => handleChange('sinopsis', event.target.value)}
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none';

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}
