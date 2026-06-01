# AcademIA - Sistema de Gestión Universitaria 🎓

![AcademIA Version](https://img.shields.io/badge/Versión-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase)

**AcademIA** es una plataforma moderna de gestión académica diseñada para brindar a docentes, administradores y estudiantes un control total sobre sus cursos, tareas pendientes y planas docentes. Cuenta con un diseño premium y corporativo basado en los colores institucionales (Azul Profundo y Rojo Carmesí).

---

## 🚀 Características Principales

### 1. Sistema de Autenticación Completo (Supabase Auth)
- **Login y Registro:** Interfaz de usuario intuitiva dividida en dos columnas (visual y formulario).
- **Recuperación de Contraseña:** Flujo completo de recuperación mediante envío de correos (`forgot-password` y `reset-password`).
- **Rutas Protegidas:** Middlewares de Next.js (`middleware.ts`) que protegen el dashboard y redireccionan de forma inteligente a usuarios no autenticados.

### 2. Panel de Control (Dashboard)
- **KPIs y Métricas:** Tarjetas (cards) interactivas que muestran el Total de Tareas, Tareas Completadas, Total de Cursos y Docentes registrados.
- **Próximas Entregas:** Un widget visual que lista las tareas urgentes basándose en su fecha de vencimiento, destacando prioridades con etiquetas de color (Alta, Media, Baja).
- **Diseño Glassmorphism:** Implementación de degradados, desenfoques y bordes redondeados elegantes.

### 3. Módulo de Cursos (CRUD)
- Data Table moderna para listar cursos.
- Inserción y actualización desde un mismo formulario integrado (sin modales obstructivos).
- Asignación de colores personalizados (Color Picker) para diferenciar fácilmente cada curso.

### 4. Módulo de Tareas (Gestor de Actividades)
- Vinculación de tareas a cursos específicos.
- Cambio de estados rápido (Pendiente -> En Progreso -> Completada) mediante clics.
- Filtros dinámicos (Todas, Pendientes, Completadas) para buscar tareas fácilmente.
- Funciones completas de creación, edición (Lápiz) y eliminación (Basurero).

### 5. Módulo de Docentes
- Directorio de profesores.
- Data Table que incluye especialidades, correos electrónicos e íconos dinámicos.
- Mantenimiento ágil usando un formulario superior para crear y editar registros.

---

## 🛠️ Stack Tecnológico

El proyecto ha sido desarrollado utilizando un stack tecnológico moderno de última generación:

- **Framework Frontend:** [Next.js 15.5](https://nextjs.org/) (App Router, Server Components).
- **Estilos y UI:** [Tailwind CSS v4.0](https://tailwindcss.com/) nativo configurado mediante `@theme` en `globals.css`, sin dependencias externas pesadas.
- **Iconografía:** [Lucide React](https://lucide.dev/) para iconos consistentes y ligeros.
- **Backend as a Service (BaaS):** [Supabase](https://supabase.com/)
  - Base de datos PostgreSQL relacional.
  - Row Level Security (RLS) habilitado para que los usuarios solo vean su propia data (`user_id`).
  - Auth Server-Side integrado con `@supabase/ssr`.
- **Despliegue (Hosting):** [Vercel](https://vercel.com/) (Despliegue continuo).

---

## 🏗️ Arquitectura de Base de Datos (Supabase)

El sistema cuenta con las siguientes tablas protegidas por políticas RLS:

1. `courses`: (id, user_id, name, code, color, created_at)
2. `tasks`: (id, user_id, title, description, priority, status, due_date, course_id, created_at)
3. `docentes`: (id, user_id, name, email, specialty, created_at)

---

## 💻 Desarrollo Local

Para correr el proyecto en tu máquina local:

1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` en la raíz del proyecto y añade tus llaves de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre `http://localhost:3000` en tu navegador.

---

## 📌 Logros y Soluciones Implementadas

Durante el desarrollo de esta versión v1.0.0, superamos diversos retos técnicos:
- **Tailwind v4 Migration:** Adaptamos variables CSS puras para inyectar correctamente la paleta institucional usando el nuevo formato `@theme` de la versión 4.
- **Optimistic UI:** Se usó el hook `useOptimistic` de React 19 para brindar respuestas ultrarrápidas al usuario al crear, editar o borrar elementos, evitando bloqueos por peticiones de red.
- **Next.js Server Actions:** Se reemplazaron las API Routes tradicionales (`/api/...`) por Server Actions de Next.js, brindando mayor seguridad e integración tipada para interactuar directamente con la base de datos de Supabase.
- **Mobile First Sidebar:** Navegación lateral que en pantallas grandes se mantiene fija a la izquierda y en celulares se oculta elegantemente detrás de un botón de menú hamburguesa (Off-canvas menu).

---
*Desarrollado para gestionar el futuro de la educación.*
