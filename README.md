# Club de Lectura — Prueba Técnica Full Stack

Aplicación web para gestionar el catálogo de libros de un club de lectura.
Incluye **autenticación** (registro, inicio y cierre de sesión) y un **CRUD
completo de libros**.

Todo el proyecto se levanta con **un único comando**:

```bash
docker compose up --build
```

---

## 1. Stack tecnológico y por qué

| Capa | Tecnología | Por qué |
|------|------------|---------|
| **Frontend** | React 19 + **Next.js 16 (App Router)** + TypeScript | Next.js da enrutado por carpetas, un entorno de producción listo para Docker (`output: standalone`) y TypeScript añade seguridad de tipos al desarrollo. |
| **Backend** | Node.js + **Express 4** (ESM) | Express es el framework más extendido, ligero y fácil de leer. Se usa el sistema de módulos ESM moderno (`import`/`export`). |
| **Base de datos** | **PostgreSQL 16** | Base de datos relacional robusta y estándar. El ISBN y el email son campos únicos, algo que encaja perfectamente con las restricciones de una BD relacional. |
| **ORM** | **Prisma 5** | Esquema declarativo, migraciones versionadas y cliente tipado. Hace que el acceso a datos sea explícito y evita SQL disperso por el código. |
| **Autenticación** | **bcrypt** + **JWT en cookie httpOnly** | Las contraseñas nunca se guardan en claro (bcrypt) y el token viaja en una cookie `httpOnly`, fuera del alcance de JavaScript y protegida de XSS. |
| **Validación** | **Zod 4** | Valida los datos de entrada en el backend con mensajes de error claros. |
| **Contenedores** | **Docker** + **Docker Compose** | Un `Dockerfile` por servicio y un `docker-compose.yml` que orquesta todo, con migraciones y seed automáticos. |
| **Estilos** | **Tailwind CSS 3** | Utilidades predecibles para una interfaz limpia sin añadir complejidad. |

---

## 2. Requisitos previos

- **Docker Desktop** (con Docker Compose v2). Es lo único imprescindible.
- **Git** (para clonar el repositorio).

Opcional, si quieres ejecutar los servicios fuera de Docker:

- **Node.js 20+** y **npm 10+**
- Una instancia de **PostgreSQL 16**

Comprueba que Docker funciona:

```bash
docker --version
docker compose version
```

---

## 3. Cómo levantar el proyecto

### Paso 1 — Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd Prueba-tecnica-Fullstack
```

### Paso 2 — Crear el archivo `.env` de la raíz

El proyecto trae un `.env.example` documentado. Cópialo:

```bash
cp .env.example .env
```

> En Windows (PowerShell): `Copy-Item .env.example .env`

> **Nota:** no es obligatorio para arrancar (el `docker-compose.yml` tiene
> valores por defecto), pero se recomienda crearlo para poder cambiar el
> `JWT_SECRET` y las credenciales de la base de datos.

### Paso 3 — Levantar todo con Docker Compose

```bash
docker compose up --build
```

Durante el arranque, el contenedor del backend hace **automáticamente**:

1. Aplica las **migraciones** pendientes a la base de datos (`prisma migrate deploy`).
2. Ejecuta el **seed** (usuario y libros de prueba, de forma idempotente).
3. Arranca la API.

### Paso 4 — Abrir la aplicación

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| API (backend) | http://localhost:4000/api |

### Detener el proyecto

```bash
docker compose down
```

Para borrar también los datos de la base de datos (volumen):

```bash
docker compose down -v
```

---

## 4. Usuario de prueba

El script de seed crea las siguientes credenciales:

| Campo | Valor |
|-------|-------|
| **Email** | `demo@readingclub.com` |
| **Contraseña** | `demo1234` |

También carga **5 libros** de ejemplo para probar el listado, el detalle y la edición.

> El seed es **idempotente** (`upsert`): se puede ejecutar muchas veces sin duplicar datos.

---

## 5. Endpoints de la API

Base de la API: `http://localhost:4000/api`

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción | Códigos |
|--------|------|-------------|---------|
| `POST` | `/api/auth/register` | Registra un usuario y crea su sesión. | `201`, `400`, `409` |
| `POST` | `/api/auth/login` | Inicia sesión con email y contraseña. | `200`, `400`, `401` |
| `POST` | `/api/auth/logout` | Cierra la sesión (elimina la cookie). | `200` |
| `GET` | `/api/auth/me` | Devuelve el usuario de la sesión actual. | `200`, `401` |

### Libros (`/api/books`) — **todas requieren sesión**

| Método | Ruta | Descripción | Códigos |
|--------|------|-------------|---------|
| `GET` | `/api/books` | Lista todos los libros. | `200`, `401` |
| `GET` | `/api/books/:id` | Detalle de un libro. | `200`, `401`, `404` |
| `POST` | `/api/books` | Crea un libro. | `201`, `400`, `401`, `409` |
| `PUT` | `/api/books/:id` | Actualiza un libro. | `200`, `400`, `401`, `404`, `409` |
| `DELETE` | `/api/books/:id` | Elimina un libro. | `204`, `401`, `404` |

### Significado de los códigos HTTP

- `200` / `201` / `204`: operación correcta.
- `400` **Bad Request**: los datos enviados no pasan la validación (por ejemplo, un año futuro o páginas ≤ 0).
- `401` **Unauthorized**: no hay sesión válida, o las credenciales son incorrectas.
- `404` **Not Found**: el recurso no existe.
- `409` **Conflict**: ya existe un registro con ese dato único (email o ISBN).

### Ejemplo de cuerpo para crear/editar un libro

```json
{
  "isbn": "9780307476463",
  "titulo": "Cien años de soledad",
  "autor": "Gabriel García Márquez",
  "genero": "Novela",
  "anio_publicacion": 1967,
  "paginas": 471,
  "sinopsis": "La saga de la familia Buendía en Macondo."
}
```

---

## 6. Estructura del proyecto

```text
Prueba-tecnica-Fullstack/
├── backend/                      # API REST (Express + Prisma)
│   ├── prisma/
│   │   ├── migrations/           # Migraciones versionadas
│   │   ├── schema.prisma         # Modelos User y Book
│   │   └── seed.js               # Datos de prueba (idempotente)
│   ├── src/
│   │   ├── config/               # Lectura de variables de entorno y cliente Prisma
│   │   ├── controllers/          # Capa HTTP (req/res)
│   │   ├── errors/               # Error de negocio (AppError)
│   │   ├── middlewares/          # Sesión (401), validación, errores y 404
│   │   ├── repositories/         # Acceso a datos (único lugar con Prisma)
│   │   ├── routes/               # Definición de rutas
│   │   ├── services/             # Lógica de negocio
│   │   ├── utils/                # Utilidades (JWT, asyncHandler)
│   │   ├── validators/           # Esquemas de validación (Zod)
│   │   ├── app.js                # Configuración de la app Express
│   │   └── server.js             # Arranque del servidor
│   ├── Dockerfile
│   ├── docker-entrypoint.sh      # Migraciones + seed + arranque
│   └── .env.example
├── frontend/                     # Aplicación Next.js (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (protected)/      # Rutas privadas (con guardia de sesión)
│   │   │   │   └── books/        # Listado, detalle, crear y editar
│   │   │   ├── login/            # Inicio de sesión
│   │   │   ├── register/         # Registro
│   │   │   ├── layout.tsx        # Layout raíz (incluye AuthProvider)
│   │   │   └── page.tsx          # Redirige a /books
│   │   ├── components/           # Componentes reutilizables (BookForm, ...)
│   │   ├── context/              # Contexto de autenticación
│   │   └── lib/                  # Cliente HTTP y tipos compartidos
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml            # Orquesta postgres + backend + frontend
├── .env.example                  # Variables para Docker Compose
└── README.md
```

### Arquitectura del backend: rutas → controladores → servicios → repositorios

Cada capa tiene **una sola responsabilidad**:

1. **Rutas** (`routes/`): definen las URLs y qué middlewares aplican.
2. **Controladores** (`controllers/`): traducen HTTP ↔ servicio (leen `req`, responden).
3. **Servicios** (`services/`): contienen la lógica de negocio y lanzan errores (`AppError`).
4. **Repositorios** (`repositories/`): la **única** capa que habla con PostgreSQL.

Esta separación hace el código fácil de leer, de probar y de cambiar.

---

## 7. Variables de entorno

Hay `.env.example` en **tres** niveles, cada uno documentado:

| Archivo | Para qué sirve |
|---------|----------------|
| `.env.example` (raíz) | Variables que consume **Docker Compose**. |
| `backend/.env.example` | Ejecutar el backend **fuera** de Docker. |
| `frontend/.env.example` | Ejecutar el frontend **fuera** de Docker. |

Variables principales:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Credenciales de PostgreSQL. | `readingclub` / `readingclub_pwd` / `readingclub` |
| `POSTGRES_PORT` | Puerto expuesto de PostgreSQL. | `5432` |
| `BACKEND_PORT` | Puerto de la API. | `4000` |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. | `postgresql://readingclub:readingclub_pwd@postgres:5432/readingclub?schema=public` |
| `JWT_SECRET` | Secreto para firmar los JWT. **Cámbialo en producción.** | `una_cadena_larga_y_aleatoria` |
| `JWT_EXPIRES_IN` | Vigencia del token. | `1d` |
| `CORS_ORIGIN` | Origen del frontend autorizado. | `http://localhost:3000` |
| `FRONTEND_PORT` | Puerto del frontend. | `3000` |
| `NEXT_PUBLIC_API_URL` | URL de la API tal y como la ve el navegador. | `http://localhost:4000/api` |

> Los archivos `.env` **reales nunca se suben al repositorio** (están en `.gitignore`).

---

## 8. Ejecutar sin Docker (opcional, para desarrollo)

Necesitas una base de datos PostgreSQL accesible.

**Backend:**

```bash
cd backend
cp .env.example .env        # ajusta DATABASE_URL a tu PostgreSQL local
npm install
npx prisma migrate deploy   # aplica migraciones
npx prisma db seed          # carga datos de prueba
npm run dev                 # API en http://localhost:4000
```

**Frontend** (en otra terminal):

```bash
cd frontend
cp .env.example .env        # NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev                 # app en http://localhost:3000
```

---

## 9. Decisiones técnicas

- **JWT en cookie `httpOnly` en lugar de `localStorage`:** una cookie `httpOnly`
  no es accesible desde JavaScript, lo que reduce el riesgo de robo del token
  por XSS. El backend la emite y el navegador la envía sola en cada petición
  (con `credentials: 'include'`).
- **Contraseñas con bcrypt (10 rondas):** nunca se guarda la contraseña, solo su
  hash. En el login se comparan con `bcrypt.compare`.
- **Mensaje genérico en el login:** tanto si el email no existe como si la
  contraseña es incorrecta se responde *"Email o contraseña incorrectos"*, para
  no revelar qué emails están registrados.
- **Campos en `snake_case`:** el esquema de Prisma usa los mismos nombres que
  pide el enunciado (`isbn`, `titulo`, `anio_publicacion`, `paginas`, ...) para
  no añadir capas de traducción innecesarias.
- **Validación en el backend con Zod:** validar solo en el frontend no es
  suficiente; el backend valida siempre y devuelve `400` con un mensaje claro
  que el frontend muestra al usuario.
- **`AppError` + middleware de errores centralizado:** los servicios lanzan
  errores con su código HTTP y un único middleware los convierte en respuestas
  JSON. Así no se repite `try/catch` por todo el código.
- **`asyncHandler`:** Express 4 no captura errores de funciones `async`
  automáticamente; este pequeño helper reenvía los errores al middleware.
- **Protección de rutas en dos capas:** el backend responde `401` si no hay
  sesión, y el frontend (layout `(protected)`) redirige a `/login` si no hay
  usuario.
- **Renderizado en el cliente:** la sesión vive en una cookie del dominio del
  backend; por eso el frontend obtiene los datos desde el navegador (con
  `credentials: 'include'`) en lugar de hacerlo en el servidor de Next.js.
- **Migraciones y seed automáticos:** el `docker-entrypoint.sh` del backend
  aplica `prisma migrate deploy` y ejecuta el seed antes de arrancar la API,
  de modo que `docker compose up --build` deja todo listo sin pasos manuales.
- **Persistencia con volumen con nombre:** `postgres_data` conserva los datos
  aunque se destruyan y se vuelvan a crear los contenedores.
- **Build multi-stage y usuario sin privilegios:** las imágenes de Docker son
  más pequeñas y el frontend se ejecuta con un usuario no root.

---

## 10. Flujo de trabajo con Git (GitHub Flow)

El desarrollo se hizo en ramas cortas con **Conventional Commits**
(`feat:`, `fix:`, `chore:`, `docs:`), integrándolas a `main` mediante Pull
Requests:

| Rama | Contenido |
|------|-----------|
| `main` | Rama principal y estable. |
| `chore/docker` | Estructura inicial, Dockerfiles y `docker-compose`. |
| `feature/auth` | Autenticación (registro, login, logout, rutas protegidas). |
| `feature/crud-libros` | CRUD de libros (backend y frontend). |
| `docs/readme` | Documentación del proyecto. |

---

## 11. Comandos útiles

```bash
# Levantar todo
docker compose up --build

# Ver logs de un servicio
docker compose logs -f backend

# Detener
docker compose down

# Detener y borrar los datos
docker compose down -v

# Recrear solo la base de datos desde cero
docker compose down -v && docker compose up --build
```
