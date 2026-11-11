import { redirect } from 'next/navigation';

/**
 * Página raíz. La app arranca directamente en el listado de libros;
 * si no hay sesión, el layout protegido redirige a /login.
 */
export default function HomePage() {
  redirect('/books');
}
