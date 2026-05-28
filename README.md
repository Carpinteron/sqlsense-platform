# sqlsense-platform

Repositorio del proyecto SQLSense Platform para la primera entrega.

## Estado actual

La solución está dividida en dos aplicaciones NestJS:

- `api/`: backend principal con autenticación, cursos, retos, schemas, generación de mock data e integración con IA.
- `worker/`: procesador en segundo plano con BullMQ para tareas de evaluación.
- `postgres/`: script de inicialización de la base de datos y del usuario admin de prueba.
- `docker-compose.yaml`: orquesta Redis, Postgres, backend y worker.

## Qué ya está montado

- Autenticación con login, refresh, logout y profile en `api/src/auth`.
- CRUD de cursos en `api/src/cursos`.
- CRUD de retos en `api/src/challenges`.
- CRUD de evaluaciones y reportes de submissions en `api/src/evaluations` y `api/src/submissions`.
- Resumen administrativo y métricas globales en `api/src/analytics`.
- Generación y regeneración de schemas con apoyo de IA en `api/src/schemas`.
- Generación de mock data en `api/src/mock-data`.
- Integración con el servicio de IA en `api/src/ai` usando `AI_API_KEY`, `AI_ENDPOINT` y `AI_MODEL`.
- Persistencia con Prisma y PostgreSQL multi-schema.
- Redis para tokens y colas.

## Variables de entorno

La configuración local de la API vive en `api/.env` y el ejemplo compartible está en `api/.env.example`.



## Cómo correr todo

Desde la raíz del repo:

```bash
docker compose up --build
```

Eso levanta:

- Redis
- PostgreSQL en `localhost:5432`
- API en `localhost:3001`
- Worker

Importante:

- Ese comando levanta el backend real que consume el frontend.
- Si vuelves a cambiar el backend, reconstruye la imagen con `docker compose build backend` y recrea el contenedor con `docker compose up -d backend`.

## Frontend

El frontend vive en `web/` como una app Next.js independiente. No hace falta mezclarlo con el backend para mantener la arquitectura limpia.

Para levantarlo en desarrollo:

```bash
cd web
npm run dev
```

El frontend queda en `http://localhost:3000`.

Rutas canónicas del frontend:

- Login: `http://localhost:3000/auth/login`
- Registro: `http://localhost:3000/auth/register`

Notas:

- En Windows, si `3000` ya está ocupado, Next puede usar otro puerto disponible.
- El frontend consume la API del backend por HTTP en `http://localhost:3001`.
- El login del frontend usa `POST /auth/login` contra ese backend; Swagger sigue disponible en `/api`.
- El panel de admin llama a `GET /analytics/admin-summary` y el dashboard de evaluaciones usa `GET /evaluations`; ambos requieren sesión válida.
- Si el backend no está levantado o usas una imagen vieja, los paneles pueden mostrar estados vacíos o `404`/`401`.
- La API habilita CORS para permitir el origen del frontend en `http://localhost:3000`.
- Si quieres abrir el formulario de acceso directamente, usa `/auth/login`.
- Si ves advertencias de Git sobre `LF`/`CRLF`, son solo del formato de fin de línea en Windows y no rompen el proyecto.

## Documentación API con Swagger UI

La API está documentada automáticamente con **Swagger UI**, una interfaz interactiva para probar endpoints sin necesidad de curl o Postman.

### Acceder a la documentación

Una vez que la API esté corriendo (con Docker o `npm run start:dev`):

- **Docker**: `http://localhost:3001/api`
- **npm run start:dev**: `http://localhost:3000/api`

Swagger está en `/api`, pero el frontend se conecta al backend real en `http://localhost:3001`.

### Flujo de autorización paso a paso

1. Abre Swagger UI en la URL anterior
2. Busca `POST /auth/login` y haz clic en "Try it out"
3. Completa el body con:
   ```json
   {
     "email": "admin@sqlsense.com",
     "password": "123456"
   }
   ```
4. Haz clic en "Execute"
5. Copia el `access_token` de la respuesta
6. Haz clic en el botón **"Authorize"** (arriba a la derecha, ícono de candado)
7. En el campo **"Value"**, pega: `Bearer <access_token>` (con "Bearer " al inicio)
8. Haz clic en "Authorize" y luego "Close"
9. Ahora todos los endpoints protegidos estarán autorizados — ¡pruébalos!

### Endpoints principales

- **Auth**: Login, refresh, logout, profile
- **Users**: CRUD de usuarios, cambiar roles (ADMIN)
- **Cursos**: CRUD de cursos (PROFESSOR/ADMIN)
- **Retos**: CRUD de retos SQL
- **Evaluations**: CRUD de evaluaciones por curso
- **Analytics**: Resumen administrativo global
- **Schemas**: Generar y regenerar schemas con IA
- **Mock Data**: Generar datos fake para tablas con IA

Para más detalles, ejemplos curl y cómo configurar variables de entorno, ver [api/README.md](api/README.md).

## Cómo ver la base de datos

Con Docker:

```bash
docker compose exec postgres psql -U appuser -d appdb
```

Con una GUI como DBeaver o pgAdmin:

- Host: `localhost`
- Puerto: `5432`
- Usuario: `appuser`
- Contraseña: `supersecret_dev`
- Base de datos: `appdb`

También puedes usar Prisma Studio desde `api/`.

## Primer usuario de prueba

El script de inicialización crea un administrador de ejemplo en `postgres/init.sql`.

- Email: `admin@sqlsense.com`
- Password: `123456`

