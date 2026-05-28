# SQLSense Platform API

Backend NestJS para SQLSense Platform con autenticación, gestión de cursos/retos, generación de schemas y mock data con IA.

## Arquitectura

Estructura por módulos siguiendo **Clean Architecture**:

```
src/
├── auth/                 # Autenticación, login, refresh, logout, profile
├── users/                # Gestión de usuarios y roles (ADMIN)
├── cursos/               # CRUD de cursos (PROFESSOR/ADMIN)
├── challenges/           # CRUD de retos SQL
├── evaluations/          # CRUD de evaluaciones por curso
├── analytics/            # Resumen administrativo global
├── schemas/              # Generación de schemas con IA
├── mock-data/            # Generación de mock data con IA
├── ai/                   # Integración con LLM
└── shared/               # Infraestructura compartida (Prisma, Redis)
```

Cada módulo sigue:
- `domain/` — Entidades, interfaces y errores de negocio
- `application/` — DTOs, use-cases, validaciones
- `infrastructure/` — Controllers, persistencia, mappers

## Instalación

```bash
npm install
```

## Variables de entorno

Copia `api/.env.example` a `api/.env` y completa:

```env
# Puerto
PORT=3000

# Base de datos
DATABASE_URL=postgresql://appuser:supersecret_dev@localhost:5432/appdb

# Redis
REDIS_URL=redis://localhost:6379

# Integración con IA (LM-Studio o similar)
AI_API_KEY=tu-api-key-aqui
AI_ENDPOINT=http://localhost:1234/v1/chat/completions
AI_MODEL=nombre-del-modelo
```

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Correr en modo watch
npm run start:dev
```

API disponible en: `http://localhost:3000`

Si trabajas con el frontend en paralelo, recuerda que debe apuntar a `http://localhost:3001` cuando la API corre con Docker.

## Con Docker (recomendado)

Desde la **raíz del repo**:

```bash
docker compose up --build
```

API disponible en: `http://localhost:3001`

Servicios levantados:
- PostgreSQL en `localhost:5432`
- Redis en `localhost:6379`
- API en `localhost:3001`
- Worker en background

## Documentación interactiva (Swagger UI)

Una vez que la API esté corriendo, accede a:

- **Docker**: `http://localhost:3001/api`
- **npm run start:dev**: `http://localhost:3000/api`

### Flujo de autorización en Swagger UI

1. Abre Swagger UI en la URL anterior
2. Ejecuta `POST /auth/login` con credenciales de prueba:
   ```json
   {
     "email": "admin@sqlsense.com",
     "password": "123456"
   }
   ```
3. Copia el `access_token` de la respuesta
4. Haz clic en **"Authorize"** (arriba a la derecha, ícono de candado)
5. En el campo **"Value"**, pega: `Bearer <access_token>`
6. Haz clic en **"Authorize"** y **"Close"**
7. Ahora todos los endpoints protegidos estarán autorizados

## Ejemplos con curl

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sqlsense.com",
    "password": "123456"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "..."
}
```

### Acceder a endpoint protegido (ejemplo: perfil)

```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer <access_token>"
```

### Resumen administrativo

```bash
curl -X GET http://localhost:3001/analytics/admin-summary \
  -H "Authorization: Bearer <access_token>"
```

Este endpoint está restringido a `ADMIN`.

### Listar evaluaciones

```bash
curl -X GET http://localhost:3001/evaluations \
  -H "Authorization: Bearer <access_token>"
```

### Evaluaciones por curso

```bash
curl -X GET http://localhost:3001/evaluations/course/<courseId> \
  -H "Authorization: Bearer <access_token>"
```

### Generar schema con IA

```bash
curl -X POST http://localhost:3001/schemas/generate \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "halla la persona menor en la base de datos de una empresa"
  }'
```

### Generar mock data

```bash
curl -X POST http://localhost:3001/mock-data/generate \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "table": "orders",
    "rows": 100,
    "fields": {
      "customer_id": {
        "type": "foreign_key",
        "references": "customers.id"
      },
      "total": {
        "type": "decimal",
        "min": 10000,
        "max": 5000000
      },
      "created_at": {
        "type": "date",
        "from": "2026-01-01",
        "to": "2026-12-31"
      },
      "status": {
        "type": "enum",
        "values": ["PENDING", "PAID", "CANCELLED"]
      }
    }
  }'
```

## Base de datos

### Con Prisma Studio

```bash
npm run prisma:studio
```

Abre automáticamente la UI en `http://localhost:5555`.

### Con psql (Docker)

```bash
docker compose exec postgres psql -U appuser -d appdb
```

### Con DBeaver o pgAdmin

- **Host**: `localhost`
- **Puerto**: `5432`
- **Usuario**: `appuser`
- **Contraseña**: `supersecret_dev`
- **Base de datos**: `appdb`

## Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Cobertura
npm run test:cov
```

## Scripts disponibles

```bash
npm run start          # Producción
npm run start:dev      # Desarrollo con watch
npm run build          # Compilar a dist/
npm run prisma:studio  # Abrir Prisma Studio
npm run prisma:migrate # Ejecutar migraciones pendientes
npm run lint           # Lint con ESLint
npm run format         # Formato con Prettier
```

## Notas

- El API key de IA va en `AI_API_KEY=` dentro de `.env`, nunca en el código
- Todos los endpoints requieren autenticación Bearer JWT excepto `/auth/login`
- `GET /auth/profile` y `GET /analytics/admin-summary` requieren rol `ADMIN`
- Los datos de prueba (usuario admin) se crean automáticamente en `postgres/init.sql`
- Roles soportados: `STUDENT`, `PROFESSOR`, `ADMIN`
