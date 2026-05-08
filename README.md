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
- Generación y regeneración de schemas con apoyo de IA en `api/src/schemas`.
- Generación de mock data en `api/src/mock-data`.
- Integración con el servicio de IA en `api/src/ai` usando `AI_API_KEY`, `AI_ENDPOINT` y `AI_MODEL`.
- Persistencia con Prisma y PostgreSQL multi-schema.
- Redis para tokens y colas.

## Variables de entorno

La configuración local de la API vive en `api/.env` y el ejemplo compartible está en `api/.env.example`.

Importante:

- `.env` no debe versionarse.
- `.env.example` sí debe estar en Git para que el equipo tenga la plantilla.
- El `.gitignore` raíz ya ignora `.env` y permite `.env.example`.

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

## Cómo probar la API

Base URL local:

```text
http://localhost:3001
```

Endpoints principales:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/health`
- `GET /auth/profile`
- `GET /cursos`
- `GET /cursos/:id`
- `POST /cursos`
- `PUT /cursos/:id`
- `DELETE /cursos/:id`
- `GET /retos`
- `GET /retos/:id`
- `GET /retos/title/:title`
- `POST /retos`
- `PUT /retos/:id`
- `DELETE /retos/:id`
- `POST /schemas/generate`
- `POST /schemas/regenerate`
- `POST /mock-data/generate`

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

## Notas para la primera entrega

- El token de LLM no está en el código: debe ir en `api/.env` como `AI_API_KEY`.
- La base de datos y Redis ya están pensados para correr con Docker.
- Si luego quieres trabajar sin Docker, puedes levantar solo la API y apuntarla a una Postgres local.