/**
 * Mensaje de error reutilizable.
 * Se usa en formularios y páginas para mostrar errores de forma consistente.
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
