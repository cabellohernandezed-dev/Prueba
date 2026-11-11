/**
 * Tipos compartidos del frontend.
 * Reflejan exactamente lo que devuelve la API del backend.
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
