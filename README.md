# Ventek

Aplicación web para ofrecer servicios de desarrollo web y soporte tecnológico. El proyecto utiliza un frontend desarrollado con Next.js y un backend independiente conectado a una base de datos PostgreSQL.

## Enlaces del proyecto

- **Sitio web:** https://ventek-frontend.vercel.app
- **Repositorio frontend:** https://github.com/ERICKJLLO/Ventek-Frontend
- **Repositorio backend:** https://github.com/ERICKJLLO/Ventek-Backend
- **API:** https://ventek-backend.onrender.com
- **Estado de la API:** https://ventek-backend.onrender.com/healthz

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Autenticación mediante tokens.
- Consulta del perfil y actualización de los datos del usuario.
- Cambio de contraseña.
- Catálogo de servicios de desarrollo web y soporte tecnológico.
- Gestión de usuarios según el rol asignado, de acuerdo con las funcionalidades implementadas.
- Formulario de contacto para solicitar servicios.

## Catálogo de servicios

### Desarrollo web
- Página web para negocio.
- Landing page.
- Portafolio digital.
- Aplicación web.

### Soporte tecnológico
- Mantenimiento de PC.
- Mantenimiento de laptop.
- Mantenimiento de consola.
- Cambio de pasta térmica.
- Optimización de equipos.

## Credenciales para la evaluación

Estas cuentas se destinan exclusivamente a la demostración académica.

### Administrador
- **Nombre:** admin
- **Correo:** admin1@admin.com
- **Contraseña:** Admin123
### Usuario normal
- **Nombre:** usuario
- **Correo:** usuario1@user.com
- **Contraseña:** Usuario123
## Tecnologías utilizadas

### Frontend
- Next.js
- React
- TypeScript
- CSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- JSON Web Tokens (JWT)
- bcrypt

### Base de datos y despliegue
- PostgreSQL
- Supabase
- Render
- Vercel

## API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/healthz` | Comprueba el estado del servidor. |
| POST | `/api/auth/register` | Registra un usuario normal. |
| POST | `/api/auth/login` | Inicia sesión. |
| GET | `/api/auth/me` | Consulta el usuario autenticado. |
| PUT | `/api/auth/me` | Actualiza el perfil del usuario. |
| PUT | `/api/auth/me/password` | Cambia la contraseña. |
| GET | `/api/services` | Consulta el catálogo de servicios. |

## Ejecución local del frontend

Se necesita Node.js y npm instalados.

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/ERICKJLLO/Ventek-Frontend.git
   cd Ventek-Frontend
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear un archivo `.env.local` en la raíz del proyecto con la URL del backend:

   ```env
   NEXT_PUBLIC_API_URL=https://ventek-backend.onrender.com/api
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrir `http://localhost:3000` en el navegador.

