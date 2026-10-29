# Ventek Frontend — Entrega 3

Frontend de Ventek construido con Next.js App Router, TypeScript y Tailwind CSS. Consume el backend separado de `Ventek-Backend`; este repositorio no incluye ni modifica el backend.

## Instalación y ejecución

Requisitos: Node.js 20+ y una instancia del backend ejecutándose.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

La aplicación se abre en `http://localhost:3001`. El backend debe permitir ese origen mediante `FRONTEND_ORIGIN=http://localhost:3001`. Configura `NEXT_PUBLIC_API_URL` con la URL completa hasta `/api` (por defecto, `http://localhost:3000/api` para el backend local).

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base pública del backend, incluyendo `/api`. |

No se guardan secretos, credenciales ni contraseñas en este repositorio.

## Funcionalidades

- Catálogo público cargado desde `GET /api/services`, con paginación, carga, error y estado vacío.
- Registro y login contra `/api/auth/register` y `/api/auth/login`, con validación en campos y mensajes del backend.
- Sesión persistente en `localStorage`, logout y navegación diferenciada por visitante, usuario y administrador.
- Formulario público de contacto conectado al endpoint original de Formspree (`mzebojyd`), con estados de carga, error y confirmación; los usuarios autenticados conservan las interacciones persistidas en el backend.
- Perfil, configuración de tema y cambio de contraseña mediante rutas autenticadas del backend.
- Foto de perfil con selección, vista previa, cancelación, eliminación y almacenamiento persistente en Cloudinary cuando el backend está configurado.
- Solicitudes autenticadas mediante `POST /api/interactions`; el backend obtiene el usuario desde el JWT y el frontend solo envía `serviceId` y `message`.
- Historial propio en `GET /api/interactions/mias`.
- Panel admin protegido para crear, editar y eliminar servicios, con confirmación antes de eliminar.
- Cliente HTTP centralizado: componentes no llaman `fetch` directamente. Las respuestas 401/403 se muestran como errores de API y las páginas privadas redirigen según el rol.

## Estructura

```text
app/                  Rutas y layout del App Router
src/components/       Componentes visuales reutilizables
src/domain/           Tipos y validación de dominio
src/hooks/             Estado de sesión y hooks de UI
src/services/         Cliente HTTP y servicios de API
```

El backend debe aplicar la migración de perfil y configurar sus variables privadas de
Cloudinary antes de probar la persistencia de teléfono, contraseña o foto. Esas
credenciales no se necesitan ni se exponen en este frontend.

## Almacenamiento de sesión

La entrega usa `localStorage` para conservar el JWT entre recargas y pestañas. Es una solución práctica para este frontend, pero un token en `localStorage` queda expuesto si existiera una vulnerabilidad XSS. En una aplicación productiva se recomienda migrar a cookies `HttpOnly`, `Secure`, `SameSite` gestionadas por un servidor o BFF, junto con protección CSRF. El frontend no decodifica ni confía en el rol para autorizar operaciones: el backend sigue siendo la autoridad y puede devolver 401/403.

## Validación

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
