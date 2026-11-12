import { redirect } from 'next/navigation';

/**
 * Página principal de la aplicación.
 *
 * Al iniciar, muestra el listado de libros.
 * Si el usuario no ha iniciado sesión, lo redirige
 * automáticamente a la página de inicio de sesión.
 */
export default function HomePage() {
  redirect('/books');
}
