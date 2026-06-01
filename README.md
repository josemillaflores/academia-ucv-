# AcademIA - Sistema de Gestión Universitaria 🎓

![AcademIA Version](https://img.shields.io/badge/Versión-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase)

**AcademIA** es una plataforma moderna de gestión académica diseñada para brindar a docentes, administradores y estudiantes un control total sobre sus cursos, tareas pendientes y planas docentes. Cuenta con un diseño premium y corporativo basado en los colores institucionales (Azul Profundo y Rojo Carmesí).

---

## 🏗️ Estructura del Proyecto

El proyecto sigue la arquitectura de **App Router** de Next.js, organizada de forma semántica y escalable:

```text
AcademIA/
├── app/                        # Next.js App Router (Páginas y Rutas)
│   ├── (auth)/                 # Grupo de rutas para Autenticación
│   │   ├── login/              # Pantalla de Inicio de sesión
│   │   ├── signup/             # Pantalla de Registro
│   │   ├── forgot-password/    # Pantalla de Recuperación de contraseña
│   │   └── reset-password/     # Pantalla de Restablecimiento
│   ├── (app)/                  # Grupo de rutas protegidas (Requieren Login)
│   │   ├── dashboard/          # Panel principal (Métricas y resumen)
│   │   ├── courses/            # Página de Cursos
│   │   ├── tasks/              # Página de Tareas
│   │   └── docentes/           # Página de Docentes
│   ├── actions/                # Server Actions (Lógica Backend)
│   │   ├── auth.ts             # Lógica de login/registro/sesión
│   │   ├── courses.ts          # CRUD de base de datos para Cursos
│   │   ├── tasks.ts            # CRUD de base de datos para Tareas
│   │   └── docentes.ts         # CRUD de base de datos para Docentes
│   ├── globals.css             # Estilos globales y variables Tailwind v4
│   └── layout.tsx              # Root Layout principal
├── components/                 # Componentes React reutilizables (UI)
│   ├── courses/                # Componentes específicos de cursos (ej. CourseList.tsx)
│   ├── tasks/                  # Componentes específicos de tareas (ej. TaskList.tsx)
│   ├── docentes/               # Componentes específicos de docentes (ej. DocentesList.tsx)
│   └── Sidebar.tsx             # Menú de navegación lateral
├── lib/                        # Utilidades y configuración de librerías
│   └── supabase/               # Configuración del cliente Supabase SSR
│       ├── client.ts           # Cliente para Componentes Frontend
│       ├── server.ts           # Cliente para Server Actions
│       └── middleware.ts       # Protección de rutas Edge
└── public/                     # Archivos estáticos (imágenes, iconos)
```

---

## 🎯 Descripción de los Módulos

El sistema está dividido en módulos independientes y enfocados:

### 1. Módulo de Autenticación (Supabase Auth)
Encargado de la seguridad y el acceso al sistema. Maneja la creación de cuentas, inicio de sesión, y el flujo completo para restablecer contraseñas mediante correos electrónicos transaccionales. Emplea un Middleware que intercepta todas las peticiones para verificar el token de sesión y proteger el panel de control.

### 2. Panel de Control (Dashboard)
El centro de mandos de la aplicación. Muestra tarjetas interactivas (KPIs) con resúmenes estadísticos (Total de Tareas, Completadas, Total de Cursos y Docentes). También incluye una sección visual dinámica de "Próximas Entregas" para mantener a los usuarios al día.

### 3. Módulo de Gestión de Cursos (CRUD)
Permite a la institución académica registrar y organizar las materias que se dictan. 
- **Funcionalidades:** Crear nuevos cursos asignando un Nombre, Código y un "Color" representativo (vía Color Picker). Todos los cursos se muestran en un 'Data Table'. Permite editar la información de un curso existente "En línea" usando un botón de lápiz y eliminarlo si es necesario.

### 4. Módulo de Tareas y Actividades
Es un gestor tipo "To-Do" orientado al contexto universitario. 
- **Funcionalidades:** Cada tarea registrada requiere un Título, Descripción, Fecha de Vencimiento y puede ser vinculada directamente a un *Curso* existente. Permite marcar Prioridades (Alta, Media, Baja) que cambian el color de la alerta, y alterar el estado (Pendiente, En Progreso, Completada) con un clic. Dispone de filtros de vista rápida.

### 5. Módulo de Plana Docente
Un directorio administrativo para organizar al equipo de profesores.
- **Funcionalidades:** Permite añadir los datos básicos como el Nombre Completo, Especialidad o Departamento Académico, y el Correo Electrónico Institucional. Se muestra en una lista tabular limpia, y permite actualizar la información usando el sistema unificado de edición.

---

## 🛡️ Buenas Prácticas Implementadas

Para garantizar que el software sea robusto, mantenible y veloz, se adoptaron las siguientes directrices de desarrollo:

1. **Uso de "Server Actions" en lugar de APIs Tradicionales:**
   Toda la mutación de datos (Crear, Editar, Eliminar) ocurre mediante las `actions` de Next.js. Esto elimina la necesidad de crear endpoints `/api/`, reduce el código cliente, mejora la seguridad (se procesa en el backend) y previene errores de tipo CORS.

2. **UI Optimista (Optimistic Updates):**
   Implementación del hook `useOptimistic` de React 19. Cuando un usuario guarda, edita o elimina un registro (ej. una Tarea), la interfaz de usuario refleja el cambio **inmediatamente**, sin esperar a que el servidor de Supabase responda. Si hay un error, revierte los datos de manera transparente. Esto da una sensación de velocidad extrema (0 latencia).

3. **Arquitectura de Base de Datos Segura (RLS - Row Level Security):**
   Ningún usuario puede ver, modificar o eliminar datos de otro usuario. Se crearon políticas de seguridad directamente a nivel de base de datos en Supabase, obligando a que toda consulta SQL verifique que `user_id = auth.uid()`.

4. **Diseño "Mobile-First" e Interfaz Adaptable:**
   El menú (Sidebar) está diseñado para pantallas grandes, pero en teléfonos móviles (Mobile First) se oculta automáticamente dentro de un menú hamburguesa con un fondo difuminado de cristal ("drawer"), evitando saturar la pantalla pequeña y garantizando accesibilidad total.

5. **Re-uso de Formularios para Edición (Edición en línea):**
   En lugar de crear decenas de ventanas emergentes (Modales) que tapan el contenido o son molestas en móviles, el sistema re-utiliza el formulario de "Creación" ubicado en la cabecera. Al presionar "Editar", los datos viajan mágicamente arriba y el botón cambia a "Actualizar". Esto facilita la usabilidad ("UX") rápida y en 1 solo paso.

6. **Tipado Estricto (TypeScript):**
   Interfaces de datos bien definidas (`type Task`, `type Course`, `type Docente`) para prevenir errores en tiempo de compilación.

---

## 🛠️ Stack Tecnológico

- **Frontend:** [Next.js 15.5](https://nextjs.org/)
- **Estilos:** [Tailwind CSS v4.0](https://tailwindcss.com/) nativo (`@theme`).
- **Iconos:** [Lucide React](https://lucide.dev/).
- **Backend/DB:** [Supabase](https://supabase.com/) (PostgreSQL + RLS + Auth SSR).
- **Despliegue:** [Vercel](https://vercel.com/) (CI/CD Automatizado).

---

## 💻 Desarrollo Local

1. Clona este repositorio.
2. Instala las dependencias: `npm install`
3. Crea un archivo `.env.local` con tus variables de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```
4. Inicia el servidor de desarrollo: `npm run dev`
5. Abre `http://localhost:3000` en tu navegador.

---
*Desarrollado para gestionar el futuro de la educación.*
