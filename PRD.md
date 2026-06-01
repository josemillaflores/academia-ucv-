# PRD — AcademIA
**Versión:** 1.0 · **Estado:** Draft · **Fecha:** 2026-05-31

---

## 1. Resumen Ejecutivo

AcademIA es una aplicación web para estudiantes de maestría que centraliza la gestión de cursos y tareas académicas en un solo lugar. El MVP elimina la fricción de usar hojas de cálculo o apps genéricas al ofrecer una experiencia orientada al contexto académico: asignación de tareas por curso, priorización, seguimiento de estado y un tablero de métricas personales.

**Stack:** Next.js 15 (App Router) + TypeScript · Tailwind CSS + shadcn/ui · Supabase (Auth + PostgreSQL + RLS) · Vercel

**Alcance del MVP:** Autenticación, gestión de cursos, gestión de tareas, tablero de métricas.

---

## 2. Personas y Casos de Uso

### Persona Principal — "María, estudiante de maestría"
- 26 años, trabaja medio tiempo, cursa 4 materias por semestre.
- Usa el celular para consultar y la laptop para trabajar.
- Necesita saber de un vistazo qué tiene pendiente y para cuándo.

| Caso de Uso | Descripción |
|---|---|
| CU-01 | Registrarse e iniciar sesión con correo y contraseña |
| CU-02 | Crear, editar y eliminar cursos con nombre, código y color |
| CU-03 | Crear tareas asociadas a un curso con prioridad, fecha límite y estado |
| CU-04 | Cambiar el estado de una tarea (pendiente → en progreso → completada) |
| CU-05 | Visualizar métricas: tareas totales, completadas, próximas a vencer |

---

## 3. Historias de Usuario

| ID | Historia | Criterio de aceptación resumido |
|---|---|---|
| HU-01 | **Como** estudiante **quiero** registrarme con correo y contraseña **para** acceder de forma segura a mis datos | Registro exitoso redirige al dashboard; errores muestran mensaje claro |
| HU-02 | **Como** estudiante **quiero** crear un curso con nombre, código y color **para** identificar visualmente mis materias | El curso aparece en la lista inmediatamente; el color se aplica a todas sus tareas |
| HU-03 | **Como** estudiante **quiero** editar o eliminar un curso **para** mantener mi lista actualizada | Eliminar curso muestra confirmación; elimina en cascada sus tareas |
| HU-04 | **Como** estudiante **quiero** agregar tareas con título, descripción, prioridad, fecha y estado **para** organizar mis entregas | La tarea aparece en la lista con el color del curso y la etiqueta de prioridad |
| HU-05 | **Como** estudiante **quiero** filtrar tareas por curso, prioridad o estado **para** enfocarme en lo más urgente | Los filtros se aplican sin recargar la página |
| HU-06 | **Como** estudiante **quiero** ver un tablero con métricas clave **para** entender mi carga académica de un vistazo | El tablero muestra: total de tareas, % completadas, tareas que vencen en 7 días |
| HU-07 | **Como** estudiante **quiero** que mis datos sean privados **para** que otros usuarios no vean mis cursos ni tareas | RLS en Supabase impide acceso cruzado entre usuarios |

---

## 4. Modelo de Datos

### 4.1 Diagrama de relaciones

```
auth.users (Supabase)
    │
    ├──< courses (user_id)
    │       │
    │       └──< tasks (course_id)
    │
    └──< tasks (user_id)
```

### 4.2 SQL DDL Completo

```sql
-- ────────────────────────────────────────────
-- Tabla: courses
-- ────────────────────────────────────────────
CREATE TABLE public.courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  code        TEXT NOT NULL CHECK (char_length(code) BETWEEN 1 AND 20),
  color       TEXT NOT NULL DEFAULT '#6366f1'
                CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_user_id ON public.courses(user_id);

-- ────────────────────────────────────────────
-- Tabla: tasks
-- ────────────────────────────────────────────
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status   AS ENUM ('pending', 'in_progress', 'completed');

CREATE TABLE public.tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id    UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  title        TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description  TEXT,
  priority     task_priority NOT NULL DEFAULT 'medium',
  status       task_status   NOT NULL DEFAULT 'pending',
  due_date     DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_user_id   ON public.tasks(user_id);
CREATE INDEX idx_tasks_course_id ON public.tasks(course_id);
CREATE INDEX idx_tasks_due_date  ON public.tasks(due_date);

-- ────────────────────────────────────────────
-- Trigger: updated_at automático
-- ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## 5. Políticas RLS (Row Level Security)

```sql
-- ── Habilitar RLS ──────────────────────────
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks   ENABLE ROW LEVEL SECURITY;

-- ── Courses ────────────────────────────────
CREATE POLICY "courses: select own"
  ON public.courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "courses: insert own"
  ON public.courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "courses: update own"
  ON public.courses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "courses: delete own"
  ON public.courses FOR DELETE
  USING (auth.uid() = user_id);

-- ── Tasks ──────────────────────────────────
CREATE POLICY "tasks: select own"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "tasks: insert own"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks: update own"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks: delete own"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);
```

> **Nota:** Asegúrate de que el rol `anon` no tenga `GRANT` sobre estas tablas. Solo el rol `authenticated` debe operar.

---

## 6. Wireframes Textuales

### 6.1 Pantalla: Login / Register
```
┌─────────────────────────────────┐
│  🎓 AcademIA                    │
│─────────────────────────────────│
│  Correo electrónico             │
│  [________________________]     │
│  Contraseña                     │
│  [________________________]     │
│                                 │
│  [  Iniciar sesión  ]           │
│  ¿No tienes cuenta? Regístrate  │
└─────────────────────────────────┘
```

### 6.2 Pantalla: Dashboard (métricas)
```
┌─────────────────────────────────────────────────┐
│ AcademIA          [Cursos] [Tareas]   [Salir]   │
│─────────────────────────────────────────────────│
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Total    │  │Completadas│  │ Vencen en    │  │
│  │  12 📋   │  │  5  ✅   │  │  7 días: 3⚠️ │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                                 │
│  Próximas tareas                                │
│  ┌─────────────────────────────────────────┐   │
│  │ [●] Entrega Final  · BD Avanzada · Alta  │   │
│  │     Vence: 04 jun                        │   │
│  │ [●] Resumen Clase  · IA · Media          │   │
│  │     Vence: 06 jun                        │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 6.3 Pantalla: Cursos
```
┌─────────────────────────────────────────────────┐
│ Cursos                          [+ Nuevo curso] │
│─────────────────────────────────────────────────│
│  ┌────────────────────────────────────────────┐ │
│  │ 🟣 Bases de Datos Avanzadas · BDA-501      │ │
│  │    8 tareas                    [✏️] [🗑️]  │ │
│  ├────────────────────────────────────────────┤ │
│  │ 🔵 Inteligencia Artificial · IA-610        │ │
│  │    4 tareas                    [✏️] [🗑️]  │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

Modal "Nuevo curso":
  Nombre del curso: [_______________]
  Código:           [_______]
  Color:            [🎨 Selector]
  [Cancelar]  [Guardar]
```

### 6.4 Pantalla: Tareas
```
┌─────────────────────────────────────────────────┐
│ Tareas                          [+ Nueva tarea] │
│ Filtrar: [Curso ▼] [Prioridad ▼] [Estado ▼]    │
│─────────────────────────────────────────────────│
│  ┌────────────────────────────────────────────┐ │
│  │ Entrega Final   🔴 Alta  · Pendiente        │ │
│  │ 🟣 BDA-501  ·  Vence: 04 jun   [✏️] [🗑️] │ │
│  ├────────────────────────────────────────────┤ │
│  │ Resumen Clase   🟡 Media · En progreso      │ │
│  │ 🔵 IA-610   ·  Vence: 06 jun   [✏️] [🗑️] │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

Modal "Nueva tarea":
  Título:      [_________________________]
  Descripción: [_________________________]
  Curso:       [Seleccionar ▼]
  Prioridad:   ○ Baja  ○ Media  ● Alta
  Estado:      ● Pendiente  ○ En progreso  ○ Completada
  Fecha límite:[📅 ___/___/______]
  [Cancelar]  [Guardar]
```

---

## 7. Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Solo en servidor (no exponer al cliente)
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

> En Vercel, configurar las mismas variables en **Settings → Environment Variables** para los entornos `Production`, `Preview` y `Development`.

---

## 8. Criterios de Aceptación por Funcionalidad

### FA-01 — Autenticación
- [ ] El usuario puede registrarse con correo + contraseña válidos.
- [ ] Registro con correo duplicado retorna error descriptivo.
- [ ] Login exitoso redirige a `/dashboard`.
- [ ] Sesión persiste al recargar la página.
- [ ] Cerrar sesión limpia la cookie y redirige a `/login`.
- [ ] Rutas protegidas redirigen a `/login` si no hay sesión.

### FA-02 — Gestión de Cursos
- [ ] CRUD completo: crear, leer, actualizar, eliminar.
- [ ] Nombre (1-100 chars) y código (1-20 chars) son requeridos.
- [ ] Color del curso se valida como hex de 6 dígitos.
- [ ] Eliminar curso muestra diálogo de confirmación.
- [ ] Eliminar curso elimina en cascada sus tareas (o `SET NULL` según config).
- [ ] Un usuario no puede ver ni modificar cursos de otro usuario.

### FA-03 — Gestión de Tareas
- [ ] CRUD completo con todos los campos del modelo.
- [ ] Título requerido (1-200 chars); descripción opcional.
- [ ] `course_id` puede ser nulo (tarea sin curso asociado).
- [ ] Filtros por curso, prioridad y estado funcionan combinados.
- [ ] Cambio de estado disponible desde la lista sin abrir el modal.
- [ ] Un usuario no puede ver ni modificar tareas de otro usuario.

### FA-04 — Tablero de Métricas
- [ ] Muestra total de tareas del usuario.
- [ ] Muestra cantidad y porcentaje de tareas completadas.
- [ ] Muestra tareas con `due_date` dentro de los próximos 7 días.
- [ ] Lista las próximas 5 tareas ordenadas por `due_date ASC`.
- [ ] Los datos reflejan cambios en tiempo real o al navegar al dashboard.

### FA-05 — Estructura Supabase
- [ ] Tablas `courses` y `tasks` creadas con el DDL exacto de la sección 4.
- [ ] RLS habilitado y todas las políticas de la sección 5 aplicadas.
- [ ] Trigger `updated_at` funciona en ambas tablas.
- [ ] El rol `anon` no puede leer ni escribir en ninguna tabla.

---

## 9. Estructura de Carpetas Sugerida (Next.js 15)

```
academ-ia/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── dashboard/page.tsx
│   │   ├── courses/page.tsx
│   │   └── tasks/page.tsx
│   ├── layout.tsx
│   └── middleware.ts          ← protección de rutas
├── components/
│   ├── ui/                    ← shadcn/ui (auto-generado)
│   ├── courses/
│   └── tasks/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          ← createBrowserClient
│   │   └── server.ts          ← createServerClient
│   └── types.ts               ← tipos TypeScript del modelo
└── .env.local
```

---

*Documento generado para uso interno del equipo de producto. Versión sujeta a revisión tras validación con stakeholders.*
