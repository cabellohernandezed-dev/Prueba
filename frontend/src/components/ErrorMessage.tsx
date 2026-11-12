/**
 * Componente para mostrar mensajes de error.
 *
 * Se puede utilizar en diferentes partes de la aplicación,
 * como formularios y páginas, para mostrar los errores
 * de manera clara y uniforme.
 */
export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {message}
    </p>
  );
}
