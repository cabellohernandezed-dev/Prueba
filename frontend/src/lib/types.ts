/**
 * Tipos compartidos del frontend.
 * Reflejan exactamente lo que devuelve la API del backend.
 */

export type User = {
  id: string;
  nombre: string;
  email: string;
};

export type Book = {
  id: string;
  isbn: string;
  titulo: string;
  autor: string;
  genero: string;
  anio_publicacion: number;
  paginas: number;
  sinopsis: string | null;
  created_at: string;
  updated_at: string;
};
