# SQLSense Web

Frontend Next.js para SQLSense Platform.

## Desarrollo local

Instala dependencias desde `web/` y arranca el servidor de desarrollo:

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Dependencias del backend

El frontend consume la API en `http://localhost:3001` cuando el backend corre con Docker.

Si cambias la URL de la API, ajusta `NEXT_PUBLIC_API_URL` en `web/.env`.

## Rutas principales

- `/auth/login`
- `/auth/register`
- `/dashboard`
- `/courses`
- `/challenges`
- `/evaluations`
- `/reports`

## Notas

- Ejecuta `npm run dev` dentro de `web/`, no desde la raíz del repo.
- El panel de admin consulta `GET /analytics/admin-summary`.
- Las vistas de evaluaciones usan `GET /evaluations` y `GET /evaluations/course/:courseId`.
- Si los charts muestran warnings de tamaño, revisa que el backend esté corriendo y que el usuario tenga sesión válida.
