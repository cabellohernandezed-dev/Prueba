## Nota sobre el uso de Inteligencia Artificial
=============================================================================================================================================================
Durante el desarrollo de este proyecto utilicé TRAE, un editor de código que incluye herramientas de IA. 

Trabajé junto con un agente de IA para desarrollar algunas partes del proyecto, resolver dudas y revisar el código.

También agregué comentarios en los archivos para explicar qué hace cada parte y cómo se relaciona con las demás. 

Esto me ayudó a comprender mejor el funcionamiento del proyecto.

Para el README, primero reuní y redacté la información por mi cuenta. 

Después utilicé la IA para completar algunas explicaciones y hacer que fueran más fáciles de entender.

Considero que la IA fue una herramienta de apoyo, pero no hizo todo el trabajo por mí. 

Antes de utilizarla, investigué y analicé lo que necesitaba hacer. También procuré revisar sus respuestas, entender el código que proponía y 

comprobar que funcionara correctamente.

Creo que la IA puede ser de mucha ayuda durante el desarrollo de un proyecto, siempre que sepamos utilizarla y

entendamos lo que estamos construyendo.

=============================================================================================================================================================

# Club de Lectura — Prueba Técnica Full Stack

Este proyecto es una aplicación web para administrar los libros de un club de lectura.

Permite registrar usuarios, iniciar sesión, consultar libros, buscar por título o autor, filtrar por género y llevar un registro personal del estado de lectura.

Para iniciar todo el proyecto, solo necesitas ejecutar este comando:

```bash
docker compose up --build
```

---

## 1. Tecnologías utilizadas

Tecnologías utilizadas
Durante el desarrollo del proyecto se utilizaron las siguientes tecnologías:

-Frontend – React 19, Next.js 16 y TypeScript

Se utilizaron para crear las páginas y los elementos con los que interactúa el usuario. TypeScript ayuda a organizar y controlar los tipos de datos.

-Backend – Node.js y Express 4

Se encargan de recibir las peticiones del frontend y realizar las operaciones del sistema.

-Base de datos – PostgreSQL 16

Se utiliza para guardar la información de los usuarios, los libros y sus estados de lectura.

-ORM – Prisma 5

Permite consultar, guardar y modificar la información de la base de datos desde el código.

-Autenticación – bcrypt y JWT

bcrypt se utiliza para proteger las contraseñas y JWT para mantener la sesión del usuario mediante una cookie httpOnly.

-Validación – Zod 4

Se utiliza para revisar que los datos recibidos sean correctos antes de procesarlos.

-Contenedores – Docker y Docker Compose

Permiten iniciar el frontend, el backend y la base de datos de manera conjunta.

-Estilos – Tailwind CSS 3

Se utiliza para dar diseño y formato a las páginas del proyecto.

---

## 2. Antes de iniciar

Para ejecutar el proyecto necesitas:

- **Docker Desktop**, con Docker Compose v2.
- **Git**, para descargar el repositorio.

Para comprobar que Docker está instalado y funcionando, abre una terminal y ejecuta:

```bash
docker --version
docker compose version
```

---

## 3. Cómo iniciar el proyecto

### Paso 1. Descargar el proyecto

Clona el repositorio y entra en la carpeta:

```bash
git clone <URL-del-repositorio>
cd Prueba-tecnica-Fullstack
```

### Paso 2. Crear el archivo `.env`

En la carpeta principal del proyecto encontrarás el archivo `.env.example`.

Haz una copia y ponle el nombre `.env`:

```bash
cp .env.example .env
```

Si utilizas Windows PowerShell, ejecuta:

```powershell
Copy-Item .env.example .env
```

Este archivo sirve para configurar algunos datos del proyecto, como las credenciales de la base de datos y la clave que se utiliza para las sesiones.

No es obligatorio crearlo para iniciar el proyecto, porque Docker Compose ya tiene algunos valores por defecto. Sin embargo, se recomienda tenerlo para poder cambiar esos valores cuando sea necesario.

### Paso 3. Iniciar los servicios

Desde la carpeta principal del proyecto, ejecuta:

```bash
docker compose up --build
```

Este comando construye las imágenes y después inicia los servicios.

Cuando inicia el backend, se realizan estos pasos automáticamente:

1. Se aplican las migraciones pendientes de Prisma a la base de datos.
2. Se ejecuta el seed, que agrega el usuario y los libros de prueba.
3. Se inicia la API del backend.

El seed puede ejecutarse más de una vez sin crear registros duplicados.

### Paso 4. Abrir la aplicación

Cuando los servicios hayan iniciado, puedes entrar desde el navegador:

-Frontend

http://localhost:3000

Es la dirección donde se encuentra la página principal del proyecto.

-Backend (API)

http://localhost:4000/api

Es la dirección donde se reciben las peticiones y se realizan las operaciones del sistema.

### Detener el proyecto

Para detener los contenedores, ejecuta:

```bash
docker compose down
```

Si también quieres borrar los datos guardados en el volumen de la base de datos, ejecuta:

```bash
docker compose down -v
```

**Importante:** el segundo comando elimina los datos guardados en la base de datos. Úsalo solo si realmente quieres empezar desde cero.

---

## 4. Usuario para realizar pruebas

Al iniciar el proyecto, el seed crea una cuenta de prueba con estos datos:

Usuario de prueba
El proyecto cuenta con un usuario de prueba para poder iniciar sesión y revisar las funciones del sistema.
- Correo: demo@readingclub.com
- Contraseña: demo1234
- Rol: admin (administrador)

También se agregan 5 libros de ejemplo para que puedas probar el listado y los filtros.

La cuenta de prueba tiene permisos de administrador. En cambio, los usuarios que se registran desde el formulario reciben el rol `consulta`.

El seed utiliza `upsert`, por lo que puede ejecutarse varias veces sin duplicar los datos.

---

## 5. Rutas de la API

La dirección principal de la API es:

```text
http://localhost:4000/api
```

### Autenticación

Estas rutas sirven para registrar usuarios, iniciar sesión, cerrar sesión y consultar quién tiene la sesión activa.

1. Registrar usuario
- Método: POST
- Ruta: /api/auth/register
- Función: Registra un nuevo usuario e inicia su sesión.
- Respuestas: 201 (creado), 400 (datos incorrectos), 409 (el usuario ya existe).

2. Iniciar sesión
- Método: POST
- Ruta: /api/auth/login
- Función: Permite iniciar sesión con el correo y la contraseña.
- Respuestas: 200 (correcto), 400 (datos incorrectos), 401 (credenciales incorrectas).

3. Cerrar sesión
- Método: POST
- Ruta: /api/auth/logout
- Función: Cierra la sesión y elimina la cookie de autenticación.
- Respuestas: 200 (correcto).

4. Consultar usuario actual
- Método: GET
- Ruta: /api/auth/me
- Función: Devuelve los datos del usuario que tiene la sesión iniciada.
- Respuestas: 200 (correcto), 401 (no ha iniciado sesión).

### Roles de usuario

El sistema tiene dos roles:

- **admin:** puede crear, consultar, editar y eliminar libros.
- **consulta:** puede consultar los libros y actualizar su propio estado de lectura.

El rol se asigna desde el backend. Cuando alguien se registra desde el formulario, se le asigna automáticamente el rol `consulta`.

### Libros

Todas las rutas de libros necesitan que el usuario haya iniciado sesión.

1. Consultar libros
- Método: GET
- Ruta: /api/books
- Función: Muestra los libros registrados. También permite buscar, aplicar filtros y cambiar de página.
- Respuestas: 200 (correcto), 400 (datos incorrectos), 401 (sin sesión).

2. Consultar géneros
- Método: GET
- Ruta: /api/books/genres
- Función: Devuelve la lista de géneros disponibles.
- Respuestas: 200 (correcto), 401 (sin sesión).

3. Consultar un libro
- Método: GET
- Ruta: /api/books/:id
- Función: Muestra los detalles de un libro por medio de su ID.
- Respuestas: 200 (correcto), 401 (sin sesión), 404 (libro no encontrado).

4. Cambiar estado de lectura
- Método: PATCH
- Ruta: /api/books/:id/reading-status
- Función: Permite cambiar el estado de lectura de un libro.
- Respuestas: 200 (correcto), 400 (datos incorrectos), 401 (sin sesión), 404 (libro no encontrado).

5. Registrar un libro
- Método: POST
- Ruta: /api/books
- Función: Agrega un nuevo libro. Esta acción solo puede realizarla un administrador.
- Respuestas: 201 (creado), 400 (datos incorrectos), 401 (sin sesión), 403 (sin permisos), 409 (conflicto).

6. Editar un libro
- Método: PUT
- Ruta: /api/books/:id
- Función: Permite modificar la información de un libro. Solo puede hacerlo un administrador.
- Respuestas: 200 (correcto), 400 (datos incorrectos), 401 (sin sesión), 403 (sin permisos), 404 (libro no encontrado), 409 (conflicto).

7. Eliminar un libro
- Método: DELETE
- Ruta: /api/books/:id
- Función: Elimina un libro del sistema. Esta acción solo puede realizarla un administrador.
- Respuestas: 204 (eliminado correctamente), 401 (sin sesión), 403 (sin permisos), 404 (libro no encontrado).

La ruta `GET /api/books` devuelve una lista de libros y la información de paginación (`books` y `pagination`).

Para cambiar de página se utilizan estos parámetros:

- `page`: indica el número de página. Empieza en 1.
- `pageSize`: indica cuántos libros se muestran por página. Puede ser de 1 a 100 y su valor por defecto es 10.
- `search`: permite buscar por título o autor.
- `genre`: permite filtrar por género.

El estado de lectura se guarda por separado para cada usuario y libro. Esto significa que cada usuario puede tener su propio progreso sin modificar el de los demás.

Los estados disponibles son:

- `pendiente`
- `leyendo`
- `leído`

### ¿Qué significan los códigos de respuesta?

- 200, 201, 204 – Operación correcta: Se muestran cuando la petición se realizó correctamente. Dependiendo de la operación, indican que se consultó, creó o eliminó información.

- 400 – Datos incorrectos: Aparece cuando la información enviada no cumple con las validaciones del sistema.

- 401 – No autorizado: Aparece cuando no hay una sesión iniciada o los datos para iniciar sesión son incorrectos.

- 403 – Acceso prohibido: Ocurre cuando el usuario inició sesión, pero no tiene permiso para realizar esa acción.

- 404 – No encontrado: Aparece cuando el libro o el recurso que se está buscando no existe.

- 409 – Conflicto: Se muestra cuando se intenta registrar un correo o ISBN que ya se encuentra registrado.

### Ejemplo de datos para registrar o editar un libro

Este es un ejemplo del JSON que se puede enviar a la API:

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

## 6. Organización de las carpetas

El proyecto está dividido en dos partes principales: `backend` y `frontend`. También tiene archivos para configurar Docker.

```text
Prueba-tecnica-Fullstack/
├── backend/                      # Código del servidor y la API
│   ├── prisma/
│   │   ├── migrations/           # Cambios realizados a la base de datos
│   │   ├── schema.prisma          # Modelos de usuarios y libros
│   │   └── seed.js                # Agrega datos de prueba
│   ├── src/
│   │   ├── config/                # Configuración y conexión a la base de datos
│   │   ├── controllers/           # Reciben las peticiones y envían respuestas
│   │   ├── errors/                # Manejo de errores de la aplicación
│   │   ├── middlewares/           # Validaciones y comprobaciones de las peticiones
│   │   ├── repositories/          # Consultas a la base de datos
│   │   ├── routes/                # Direcciones de la API
│   │   ├── services/               # Lógica principal del sistema
│   │   ├── utils/                  # Funciones de ayuda
│   │   ├── validators/             # Reglas para validar los datos
│   │   ├── app.js                  # Configuración de Express
│   │   └── server.js               # Inicia el servidor
│   ├── Dockerfile                  # Configuración de Docker para construir la imagen
│   ├── docker-entrypoint.sh        # Prepara la base de datos e inicia la API
│   └── .env.example                # Variables para Docker Compose
├── frontend/                      # Código de la página web
│   ├── src/
│   │   ├── app/
│   │   │   ├── (protected)/        # Páginas que necesitan iniciar sesión
│   │   │   │   └── books/          # Listado, detalle, registro y edición de libros
│   │   │   ├── login/              # Página para iniciar sesión
│   │   │   ├── register/           # Página para registrarse
│   │   │   ├── layout.tsx          # Estructura general de las páginas
│   │   │   └── page.tsx            # Página inicial
│   │   ├── components/             # Componentes que se pueden reutilizar
│   │   ├── context/                # Información de la sesión del usuario
│   │   └── lib/                    # Peticiones al backend y tipos de datos
│   ├── Dockerfile                  # Configuración de Docker para construir la imagen
│   └── .env.example                # Variables para Docker Compose
├── docker-compose.yml              # Configura y conecta los servicios
├── .env.example                    # Variables para Docker Compose
└── README.md                       # Documentación del proyecto
```

### Cómo se organiza el backend

El backend está dividido en varias carpetas para que cada parte tenga una tarea clara.

El recorrido de una petición es el siguiente:

1. **Rutas (`routes/`):** indican qué dirección se está utilizando y qué funciones se deben ejecutar.
2. **Controladores (`controllers/`):** reciben los datos de la petición y preparan la respuesta.
3. **Servicios (`services/`):** realizan las operaciones y aplican las reglas del sistema.
4. **Repositorios (`repositories/`):** consultan o modifican la información de la base de datos.

De esta manera, cada archivo tiene una responsabilidad y es más fácil encontrar dónde hacer cambios.

---

## 7. Variables de entorno

El proyecto tiene tres archivos `.env.example`. Cada uno se utiliza para configurar una parte diferente:

- .env.example (carpeta principal): Contiene la configuración necesaria para iniciar los servicios con Docker Compose.

- backend/.env.example: Contiene las variables que necesita el backend cuando se ejecuta sin Docker.

- frontend/.env.example: Contiene las variables que necesita el frontend cuando se ejecuta sin Docker.

Estos archivos sirven como guía para crear los archivos .env con la configuración necesaria antes de iniciar el proyecto.

### Variables principales

Configuración de PostgreSQL
- POSTGRES_USER: Usuario que se utiliza para acceder a PostgreSQL. Ejemplo: readingclub.
- POSTGRES_PASSWORD: Contraseña para acceder a la base de datos. Ejemplo: readingclub_pwd.
- POSTGRES_DB: Nombre de la base de datos. Ejemplo: readingclub.
- POSTGRES_PORT: Puerto por el que funciona PostgreSQL. Ejemplo: 5432.

Configuración del backend
- BACKEND_PORT: Puerto donde se ejecuta el backend. Ejemplo: 4000.
- DATABASE_URL: Dirección que utiliza el backend para conectarse a PostgreSQL. Ejemplo:

postgresql://readingclub:readingclub_pwd@postgres:5432/readingclub?schema=public
- JWT_SECRET: Clave que se utiliza para generar los tokens de sesión. Ejemplo: una_cadena_larga_y_aleatoria.
- JWT_EXPIRES_IN: Tiempo que dura la sesión del usuario. Ejemplo: 1d (un día).
- CORS_ORIGIN: Dirección del frontend que tiene permitido comunicarse con el backend. Ejemplo: http://localhost:3000.

Configuración del frontend
- FRONTEND_PORT: Puerto donde se ejecuta el frontend. Ejemplo: 3000.
- NEXT_PUBLIC_API_URL: Dirección de la API que utiliza el navegador para comunicarse con el backend. Ejemplo: http://localhost:4000/api.

**Importante:** los archivos `.env` reales no deben subirse a GitHub porque pueden contener contraseñas y otros datos privados. Por eso están agregados al archivo `.gitignore`.

Las variables que comienzan con `NEXT_PUBLIC_` pueden verse desde el navegador. No guardes contraseñas ni claves privadas en ellas.

---

## 8. Ejecutar el proyecto sin Docker

Esta opción es para cuando quieras iniciar el frontend y el backend por separado.

Antes de comenzar, necesitas tener PostgreSQL instalado y funcionando.

### Iniciar el backend

Abre una terminal y ejecuta:

```bash
cd backend
```

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Revisa el archivo `.env` y configura `DATABASE_URL` con los datos de tu PostgreSQL local.

Después instala las dependencias:

```bash
npm install
```

Aplica las migraciones para preparar las tablas de la base de datos:

```bash
npx prisma migrate deploy
```

Carga los datos de prueba:

```bash
npx prisma db seed
```

Por último, inicia el backend:

```bash
npm run dev
```

La API estará disponible en:

```text
http://localhost:4000
```

### Iniciar el frontend

Abre otra terminal y ejecuta:

```bash
cd frontend
```

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Revisa que `NEXT_PUBLIC_API_URL` tenga esta dirección:

```text
http://localhost:4000/api
```

Instala las dependencias:

```bash
npm install
```

Inicia el frontend:

```bash
npm run dev
```

La página estará disponible en:

```text
http://localhost:3000
```

---

## 9. Algunas decisiones del proyecto

En esta sección explico algunas decisiones que se tomaron durante el desarrollo.

- **Sesión con JWT y cookie `httpOnly`:** se utiliza una cookie para guardar el token de sesión. Al ser `httpOnly`, JavaScript no puede leerla directamente desde el navegador.
- **Contraseñas con bcrypt:** las contraseñas no se guardan directamente. Se guarda una versión protegida (hash) y, al iniciar sesión, se compara con la contraseña ingresada. Se utilizan 10 rondas.
- **Mensaje de inicio de sesión:** si el correo no existe o la contraseña es incorrecta, se muestra el mismo mensaje: "Email o contraseña incorrectos". Así no se indica si un correo está registrado.
- **Nombres de campos:** se utilizan nombres como `isbn`, `titulo`, `anio_publicacion` y `paginas` para mantener los mismos nombres en el proyecto.
- **Validación con Zod:** el backend revisa los datos antes de guardarlos. Si encuentra un dato incorrecto, responde con un error `400` y un mensaje que el frontend puede mostrar.
- **Manejo de errores:** se utiliza `AppError` junto con un middleware para responder los errores desde un solo lugar.
- **asyncHandler:** se utiliza porque Express 4 necesita ayuda para enviar los errores de las funciones asíncronas al middleware de errores.
- **Protección de páginas:** el backend revisa que exista una sesión válida. Además, el frontend redirige al usuario a `/login` cuando no ha iniciado sesión.
- **Consulta de la sesión:** el frontend obtiene los datos del usuario desde el navegador usando la cookie de sesión.
- **Migraciones y datos de prueba:** al iniciar con Docker, el backend prepara la base de datos y carga los datos de prueba automáticamente.
- **Datos guardados en Docker:** PostgreSQL utiliza un volumen llamado `postgres_data`. Esto permite conservar los datos aunque se eliminen los contenedores.
- **Imágenes de Docker:** se utilizan varias etapas para crear las imágenes y el frontend se ejecuta con un usuario que no es administrador del sistema.

---

## 10. Cómo se trabajó con Git

Durante el desarrollo se utilizaron ramas para separar los cambios y mantener organizada la rama principal `main`.

También se utilizaron mensajes de commit con prefijos para identificar el tipo de cambio, por ejemplo:

- `feat:` para agregar una función.
- `fix:` para corregir un error.
- `chore:` para tareas de configuración.
- `docs:` para cambios en la documentación.

Las ramas utilizadas fueron:

main: Contiene la versión principal del proyecto.

chore/docker: Contiene los archivos y la configuración inicial de Docker.

feature/auth: Incluye el registro, inicio y cierre de sesión, así como la protección de páginas.

feature/crud-libros: Contiene las funciones para crear, consultar, editar y eliminar libros.

docs/readme: Se utilizó para trabajar en la documentación del proyecto.

Los cambios se integraron a `main` mediante Pull Requests.

---

## 11. Comandos que pueden ser útiles

Estos son algunos comandos que puedes utilizar para trabajar con Docker Compose:

```bash
# Iniciar todo el proyecto
docker compose up --build

# Ver los mensajes del backend
docker compose logs -f backend

# Detener los contenedores
docker compose down

# Detener los contenedores y borrar los datos de la base de datos
docker compose down -v

# Iniciar el proyecto nuevamente desde cero
docker compose down -v && docker compose up --build
```

Recuerda que `docker compose down -v` borra el volumen de la base de datos. Si lo ejecutas, perderás los datos que se habían guardado.

---

## 12. Despliegue 

El proyecto se subió a **Railway**, que es una plataforma en la nube donde puedo tener el backend, el frontend y la base de datos todo junto sin tener que configurar un servidor manualmente.

### Dónde quedó

- **Frontend (la app que se ve en el navegador):** https://frontend-production-b2a71cbe.up.railway.app
- **Backend (la API):** https://backend-production-c5e5a2f5.up.railway.app/api
- **Base de datos:** PostgreSQL creado dentro de Railway y gestionado por Railway.

### Cómo lo subí 

1. Instalé el programa de Railway en la computadora con `npm install -g @railway/cli`.
2. Inicié sesión con `railway login` y me mandó a autorizar en el navegador.
3. Creé un proyecto en Railway llamado `reading-club`.
4. Dentro de ese proyecto creé tres servicios:
   - **Postgres** = la base de datos.
   - **backend** = usa el `Dockerfile` de la carpeta `backend/`.
   - **frontend** = usa el `Dockerfile` de la carpeta `frontend/`.
5. Configuré las variables de entorno que necesita cada servicio (las de `.env.example`), por ejemplo `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL` y `CORS_ORIGIN`.
6. Subí cada parte con `railway up` (desde la carpeta del backend y desde la del frontend, por separado).
7. A cada servicio le pedí una dirección pública con `railway domain`.

### Un detalle importante de la sesión

Como el frontend y el backend quedaron en direcciones distintas (dos subdominios de `up.railway.app`), la cookie de inicio de sesión no se enviaba entre ellos y no se podía entrar.

Para arreglarlo, hice que el frontend use un **proxy**: ahora el navegador solo habla con el frontend (en `/api`) y el propio Next.js reenvía esas peticiones al backend. Así la cookie es "del mismo sitio" y funciona. Los archivos que cambié para esto son `frontend/next.config.mjs` y `frontend/src/lib/api.ts`.

### Usuario de prueba (Admin)
- Correo: `cabello@gmail.com`
- Contraseña: `Lalo12345`
- Rol: `admin`

### Usuario de prueba (Consulta)
Solo registrarse
