import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

/**
 * Script de datos de prueba (seed).
 *
 * Es IDEMPOTENTE: usa `upsert`, así que se puede ejecutar muchas veces (por
 * ejemplo en cada arranque del contenedor) sin duplicar registros.
 * Se ejecuta con: `npx prisma db seed`
 */

const prisma = new PrismaClient();

const TEST_USER = {
  nombre: 'Usuario de Prueba',
  email: 'demo@readingclub.com',
  password: 'demo1234',
};

const BOOKS = [
  {
    isbn: '9780307476463',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    genero: 'Novela',
    anio_publicacion: 1967,
    paginas: 471,
    sinopsis:
      'La saga de la familia Buendía en el pueblo ficticio de Macondo, obra clave del realismo mágico.',
  },
  {
    isbn: '9780060850524',
    titulo: 'Sapiens: De animales a dioses',
    autor: 'Yuval Noah Harari',
    genero: 'Historia',
    anio_publicacion: 2011,
    paginas: 498,
    sinopsis:
      'Un recorrido por la historia de la humanidad, desde los primeros homínidos hasta la actualidad.',
  },
  {
    isbn: '9780441013593',
    titulo: 'Dune',
    autor: 'Frank Herbert',
    genero: 'Ciencia ficción',
    anio_publicacion: 1965,
    paginas: 688,
    sinopsis:
      'En el planeta desértico Arrakis, la lucha por el control de la especia enfrenta a casas nobiliarias.',
  },
  {
    isbn: '9780451524935',
    titulo: '1984',
    autor: 'George Orwell',
    genero: 'Ciencia ficción',
    anio_publicacion: 1949,
    paginas: 328,
    sinopsis:
      'Distopía sobre un régimen totalitario que controla la información y la vida privada de sus ciudadanos.',
  },
  {
    isbn: '9780307949486',
    titulo: 'El nombre del viento',
    autor: 'Patrick Rothfuss',
    genero: 'Fantasía',
    anio_publicacion: 2007,
    paginas: 662,
    sinopsis: null,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(TEST_USER.password, 10);

  await prisma.user.upsert({
    where: { email: TEST_USER.email },
    update: { role: 'admin' },
    create: {
      nombre: TEST_USER.nombre,
      email: TEST_USER.email,
      password_hash: passwordHash,
      role: 'admin',
    },
  });

  for (const book of BOOKS) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
  }

  console.log(
    `Seed completado: usuario "${TEST_USER.email}" y ${BOOKS.length} libros.`,
  );
}

main()
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
