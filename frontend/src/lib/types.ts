/**
 * Tipos compartidos del frontend.
 *
 * Define los tipos de datos que utiliza la aplicación.
 * Estos tipos coinciden con la información que recibe
 * del backend para mantener una comunicación correcta.
 */

export type User = {
  id: string;
  nombre: string;
  email: string;
  role: 'admin' | 'consulta';
};

export type ReadingStatus = 'pendiente' | 'leyendo' | 'leído';

export type Book = {
  id: string;
  isbn: string;
  titulo: string;
  autor: string;
  genero: string;
  anio_publicacion: number;
  paginas: number;
  sinopsis: string | null;
  estado_lectura: ReadingStatus;
  created_at: string;
  updated_at: string;
};
