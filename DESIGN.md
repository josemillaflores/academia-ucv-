# DESIGN.md — AcademIA Visual System
**Versión:** 1.0 · **Fecha:** 2026-05-31  
**Compatible con:** Stitch MCP · Antigravity · Tailwind CSS v3+ · shadcn/ui

> Fuente de verdad visual para AcademIA. Toda decisión de diseño parte de este documento.  
> Tono de referencia: **Notion × Linear** — limpio, preciso, académico sin ser frío.

---

## 1. Filosofía Visual

| Principio | Descripción |
|---|---|
| **Claridad ante todo** | La jerarquía de información es más importante que la decoración |
| **Densidad intencional** | Compacto cuando es lista, espacioso cuando es foco |
| **Confianza académica** | Profesional sin ser aburrido; urgente sin ser ansioso |
| **Consistencia sistémica** | Todo deriva del sistema de tokens — nunca valores magic number |

---

## 2. Paleta de Colores

### 2.1 Colores Base (modo claro y oscuro)

```css
/* ── Primitivos (no usar directamente en componentes) ── */
--color-indigo-50:  #eef2ff;
--color-indigo-100: #e0e7ff;
--color-indigo-200: #c7d2fe;
--color-indigo-500: #6366f1;
--color-indigo-600: #4f46e5;
--color-indigo-700: #4338ca;

--color-slate-50:   #f8fafc;
--color-slate-100:  #f1f5f9;
--color-slate-200:  #e2e8f0;
--color-slate-400:  #94a3b8;
--color-slate-500:  #64748b;
--color-slate-700:  #334155;
--color-slate-800:  #1e293b;
--color-slate-900:  #0f172a;
--color-slate-950:  #020617;

--color-violet-500: #8b5cf6;
--color-emerald-500:#10b981;
--color-amber-500:  #f59e0b;
--color-rose-500:   #f43f5e;
```

### 2.2 Tokens Semánticos — Modo Claro (`:root`)

```css
:root {
  /* Marca */
  --brand-primary:        #4f46e5;   /* Indigo-600 — CTAs, links activos */
  --brand-primary-hover:  #4338ca;   /* Indigo-700 */
  --brand-primary-subtle: #eef2ff;   /* Indigo-50  — fondos de chips/badges */
  --brand-secondary:      #8b5cf6;   /* Violet-500 — acentos secundarios */

  /* Superficie */
  --surface-base:         #ffffff;
  --surface-raised:       #f8fafc;   /* Cards, sidebar */
  --surface-overlay:      #f1f5f9;   /* Modal backdrop inner */
  --surface-border:       #e2e8f0;

  /* Texto */
  --text-primary:         #0f172a;
  --text-secondary:       #334155;
  --text-tertiary:        #64748b;
  --text-disabled:        #94a3b8;
  --text-on-brand:        #ffffff;

  /* Interactividad */
  --focus-ring:           #6366f1;   /* outline de focus */

  /* Semáforo de prioridad */
  --priority-high-bg:     #fff1f2;
  --priority-high-text:   #e11d48;
  --priority-high-border: #fecdd3;

  --priority-medium-bg:   #fffbeb;
  --priority-medium-text: #d97706;
  --priority-medium-border:#fde68a;

  --priority-low-bg:      #f0fdf4;
  --priority-low-text:    #16a34a;
  --priority-low-border:  #bbf7d0;

  /* Semáforo de estado */
  --status-pending-bg:    #f8fafc;
  --status-pending-text:  #475569;
  --status-progress-bg:   #eff6ff;
  --status-progress-text: #2563eb;
  --status-done-bg:       #f0fdf4;
  --status-done-text:     #15803d;

  /* Feedback del sistema */
  --feedback-success:     #10b981;
  --feedback-warning:     #f59e0b;
  --feedback-error:       #f43f5e;
  --feedback-info:        #4f46e5;
}
```

### 2.3 Tokens Semánticos — Modo Oscuro (`.dark`)

```css
.dark {
  --brand-primary:        #818cf8;   /* Indigo más brillante sobre fondo oscuro */
  --brand-primary-hover:  #a5b4fc;
  --brand-primary-subtle: #1e1b4b;

  --surface-base:         #0f172a;
  --surface-raised:       #1e293b;
  --surface-overlay:      #334155;
  --surface-border:       #334155;

  --text-primary:         #f8fafc;
  --text-secondary:       #cbd5e1;
  --text-tertiary:        #94a3b8;
  --text-disabled:        #475569;
  --text-on-brand:        #0f172a;

  --priority-high-bg:     #1c0a0e;
  --priority-high-text:   #fda4af;
  --priority-high-border: #881337;

  --priority-medium-bg:   #1c1400;
  --priority-medium-text: #fcd34d;
  --priority-medium-border:#92400e;

  --priority-low-bg:      #052e16;
  --priority-low-text:    #86efac;
  --priority-low-border:  #166534;

  --status-pending-bg:    #1e293b;
  --status-pending-text:  #94a3b8;
  --status-progress-bg:   #1e3a5f;
  --status-progress-text: #93c5fd;
  --status-done-bg:       #052e16;
  --status-done-text:     #86efac;

  --feedback-success:     #34d399;
  --feedback-warning:     #fbbf24;
  --feedback-error:       #fb7185;
  --feedback-info:        #818cf8;
}
```

### 2.4 Referencia visual rápida

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--brand-primary` | `#4f46e5` | `#818cf8` | Botones CTA, links |
| `--surface-base` | `#ffffff` | `#0f172a` | Fondo de página |
| `--surface-raised` | `#f8fafc` | `#1e293b` | Cards, sidebar |
| `--text-primary` | `#0f172a` | `#f8fafc` | Títulos y cuerpo |
| `--priority-high-text` | `#e11d48` | `#fda4af` | Badge "Alta" |
| `--priority-medium-text`| `#d97706` | `#fcd34d` | Badge "Media" |
| `--priority-low-text` | `#16a34a` | `#86efac` | Badge "Baja" |

---

## 3. Tipografía

### 3.1 Fuentes

```css
/* Importar en layout.tsx o globals.css */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

:root {
  --font-sans: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'DM Mono', ui-monospace, monospace;
}
```

> **DM Sans** — geométrica humanista. Legible, moderna, académicamente seria sin ser corporativa.  
> **DM Mono** — para fechas, códigos de curso y valores numéricos en el tablero.

### 3.2 Escala tipográfica

| Token | rem | px | Peso | Uso |
|---|---|---|---|---|
| `--text-xs` | 0.75rem | 12px | 400 | Labels, metadatos |
| `--text-sm` | 0.875rem | 14px | 400/500 | Cuerpo secundario, timestamps |
| `--text-base` | 1rem | 16px | 400 | Cuerpo principal |
| `--text-lg` | 1.125rem | 18px | 500 | Subtítulos de sección |
| `--text-xl` | 1.25rem | 20px | 600 | Títulos de card / modal |
| `--text-2xl` | 1.5rem | 24px | 700 | Títulos de página |
| `--text-3xl` | 1.875rem | 30px | 700 | Métricas del dashboard |

### 3.3 Adaptación responsive

```css
/* Mobile-first breakpoints (Tailwind defaults) */
/* sm: 640px · md: 768px · lg: 1024px · xl: 1280px */

/* Ejemplo: título de página */
.page-title {
  font-size: var(--text-xl);       /* mobile: 20px */
}
@media (min-width: 768px) {
  .page-title {
    font-size: var(--text-2xl);    /* desktop: 24px */
  }
}

/* Métricas del dashboard */
.metric-value {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
}
@media (min-width: 768px) {
  .metric-value {
    font-size: var(--text-3xl);
  }
}
```

### 3.4 Clases Tailwind de referencia

| Rol | Clase Tailwind |
|---|---|
| Título de página | `text-xl md:text-2xl font-bold tracking-tight` |
| Subtítulo sección | `text-lg font-semibold` |
| Cuerpo | `text-base font-normal leading-relaxed` |
| Cuerpo secundario | `text-sm text-[--text-secondary]` |
| Label / chip | `text-xs font-medium uppercase tracking-wide` |
| Código / métrica | `font-mono text-sm` |

---

## 4. Espaciado

### 4.1 Sistema base de 4 px

```
4px  → gap-1   → micro (iconos, badges)
8px  → gap-2   → interno de componentes
12px → gap-3   → entre elementos relacionados
16px → gap-4   → padding de cards
20px → gap-5   → separación de secciones dentro de una card
24px → gap-6   → entre cards
32px → gap-8   → secciones de página
48px → gap-12  → secciones mayores / hero
64px → gap-16  → separación de bloques en desktop
```

### 4.2 Radios de borde

```css
--radius-sm:  4px;    /* badges, chips */
--radius-md:  8px;    /* inputs, botones */
--radius-lg: 12px;    /* cards */
--radius-xl: 16px;    /* modales, sidebars */
--radius-full: 9999px; /* avatars, toggles */
```

### 4.3 Sombras

```css
--shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
--shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05);
--shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.05);
```

> En modo oscuro, reducir opacidad de sombras a la mitad o reemplazar por `border` en `--surface-border`.

---

## 5. Componentes

### 5.1 Button

```
Variantes: primary | secondary | ghost | destructive
Tamaños:   sm (h-8) | md (h-10, default) | lg (h-12)
Estados:   default | hover | focus | disabled | loading
```

| Variante | Fondo | Texto | Borde |
|---|---|---|---|
| `primary` | `--brand-primary` | `--text-on-brand` | — |
| `secondary` | `--surface-raised` | `--text-primary` | `--surface-border` |
| `ghost` | transparente | `--text-secondary` | — |
| `destructive` | `--feedback-error` | white | — |

```css
/* Especificaciones comunes */
.btn {
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-weight: 500;
  transition: background 150ms ease, box-shadow 150ms ease;
  outline-offset: 2px;
}
.btn:focus-visible {
  outline: 2px solid var(--focus-ring);
}
.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
```

### 5.2 Card

```
Padding:       p-4 (mobile) → p-6 (md+)
Border:        1px solid --surface-border
Border-radius: --radius-lg
Background:    --surface-raised
Shadow:        --shadow-sm (hover: --shadow-md)
Transición:    shadow 200ms ease
```

**Anatomía:**
```
┌─────────────────────────────────┐
│  [Ícono]  Título           [⋯] │  ← header: flex justify-between
│  Subtítulo / metadata           │  ← text-sm text-secondary
│─────────────────────────────────│  ← border-t surface-border (opcional)
│  Contenido principal            │
│                                 │
│  [Badge prioridad]  Fecha →     │  ← footer: flex justify-between items-center
└─────────────────────────────────┘
```

### 5.3 Modal

```
Overlay:       bg-slate-900/60 backdrop-blur-sm
Contenedor:    --surface-base, --radius-xl, --shadow-xl
Ancho:         max-w-md (sm) → max-w-lg (md+)
Padding:       p-6
Animación:     fade-in + scale 95%→100% en 200ms (ease-out)
Cierre:        Esc · click en overlay · botón × explícito
```

```css
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(4px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);   }
}
.modal { animation: modal-in 200ms ease-out; }
```

### 5.4 Toast

```
Posición:   bottom-right (desktop) · bottom-center (mobile)
Ancho:      max-w-sm
Duración:   4s auto-dismiss (error: manual dismiss)
Stack:      máximo 3 toasts visibles
```

| Tipo | Ícono Lucide | Color borde izquierdo |
|---|---|---|
| `success` | `CheckCircle2` | `--feedback-success` |
| `error` | `XCircle` | `--feedback-error` |
| `warning` | `AlertTriangle` | `--feedback-warning` |
| `info` | `Info` | `--feedback-info` |

```css
.toast {
  border-left: 4px solid currentColor;
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  box-shadow: var(--shadow-lg);
  padding: 12px 16px;
}
```

### 5.5 Sidebar

```
Ancho:         240px (desktop) | full-screen drawer (mobile)
Fondo:         --surface-raised
Border-right:  1px solid --surface-border
Posición:      sticky, top-0, h-screen
```

**Estructura:**
```
┌────────────────────────┐
│ 🎓 AcademIA            │  ← Logo + nombre (h-16)
│────────────────────────│
│ ○  Dashboard            │  ← Nav item (activo: brand-primary-subtle + brand-primary)
│ ○  Cursos               │
│ ○  Tareas               │
│────────────────────────│
│ [Avatar]  María G.  ⚙️ │  ← User row (mt-auto)
└────────────────────────┘
```

```css
/* Nav item */
.nav-item {
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: var(--text-secondary);
  transition: background 120ms ease, color 120ms ease;
}
.nav-item:hover {
  background: var(--surface-overlay);
  color: var(--text-primary);
}
.nav-item.active {
  background: var(--brand-primary-subtle);
  color: var(--brand-primary);
  font-weight: 500;
}
```

### 5.6 Badge / Chip

Usado para prioridad y estado. Siempre acompañado de ícono Lucide.

```
Border-radius: --radius-sm
Padding:       px-2 py-0.5
Font:          text-xs font-medium
```

| Tipo | Ícono | Tokens |
|---|---|---|
| Prioridad Alta | `ArrowUp` | `priority-high-*` |
| Prioridad Media | `Minus` | `priority-medium-*` |
| Prioridad Baja | `ArrowDown` | `priority-low-*` |
| Pendiente | `Circle` | `status-pending-*` |
| En progreso | `Clock` | `status-progress-*` |
| Completada | `CheckCircle2` | `status-done-*` |

---

## 6. Iconografía

**Librería:** [Lucide Icons](https://lucide.dev) — consistente, open source, tree-shakeable.  
**Tamaño estándar:** `size={16}` (inline) · `size={20}` (botones) · `size={24}` (navegación/vacío states)  
**Stroke width:** `strokeWidth={1.5}` — más ligero y elegante que el default de 2.

### Mapa de íconos por contexto

| Contexto | Ícono |
|---|---|
| Dashboard | `LayoutDashboard` |
| Cursos | `BookOpen` |
| Tareas | `CheckSquare` |
| Nueva tarea | `Plus` |
| Editar | `Pencil` |
| Eliminar | `Trash2` |
| Fecha límite | `Calendar` |
| Prioridad alta | `ArrowUp` |
| Prioridad media | `Minus` |
| Prioridad baja | `ArrowDown` |
| Estado pendiente | `Circle` |
| Estado en progreso | `Clock` |
| Estado completado | `CheckCircle2` |
| Tareas por vencer | `AlertTriangle` |
| Configuración | `Settings` |
| Cerrar sesión | `LogOut` |
| Cargando | `Loader2` (con spin) |
| Búsqueda | `Search` |
| Filtro | `Filter` |
| Menú móvil | `Menu` |
| Cerrar modal | `X` |
| Color de curso | `Palette` |
| Notificación | `Bell` |

---

## 7. Estados del Sistema

### 7.1 Cargando (Loading)

```
Estrategia: Skeleton screens — nunca spinners de página completa.
Skeletons:  bg-slate-200 dark:bg-slate-700, animate-pulse, --radius-md
```

**Skeleton de card de tarea:**
```
┌─────────────────────────────────┐
│  ████████████████       ██████  │  ← título (w-2/3) + badge (w-16)
│  ████████                       │  ← subtítulo (w-1/3)
│  ██████████     ██████████████  │  ← footer
└─────────────────────────────────┘
```

Para listas: mostrar 3 skeleton cards apilados.  
Para métricas del dashboard: 3 skeleton rectangles de `h-24`.

**Botón en estado cargando:**
```tsx
// Ícono Loader2 con spin + texto deshabilitado
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Guardando...
</Button>
```

### 7.2 Estado Vacío (Empty)

```
Ícono:      Lucide 48px, color --text-tertiary
Título:     text-base font-medium, --text-primary
Descripción:text-sm, --text-tertiary, max-w-xs centrado
CTA:        Button primary (cuando aplique)
```

| Pantalla | Ícono | Título | CTA |
|---|---|---|---|
| Sin cursos | `BookOpen` | "Aún no tienes cursos" | "Crear primer curso" |
| Sin tareas | `CheckSquare` | "Sin tareas por aquí" | "Agregar tarea" |
| Sin tareas filtradas | `Filter` | "No hay resultados" | "Limpiar filtros" |

```
        [  BookOpen  ]      ← 48px, --text-tertiary
        
    Aún no tienes cursos    ← text-base font-medium
   Crea tu primer curso y   ← text-sm --text-tertiary
   empieza a organizar tu   
       semestre.            
       
    [ + Crear curso ]       ← Button primary sm
```

### 7.3 Estado de Error

**Error en fetch (inline):**
```
Ícono:   AlertCircle 20px, --feedback-error
Mensaje: text-sm --feedback-error
Acción:  link "Reintentar" (ghost button)
```

**Error de formulario:**
```css
/* Input con error */
.input-error {
  border-color: var(--feedback-error);
  background: #fff1f2; /* dark: #1c0a0e */
}
.error-message {
  font-size: var(--text-xs);
  color: var(--feedback-error);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

**Error global (Toast):**
```
Tipo:    toast error
Mensaje: descriptivo y accionable (ej: "No se pudo guardar. Revisa tu conexión.")
Dismiss: manual (no auto-dismiss en errores)
```

---

## 8. Modo Claro / Oscuro

### 8.1 Activación

```tsx
// Usar next-themes en layout.tsx
// Clase .dark se aplica al <html>
// Preferencia persiste en localStorage
```

### 8.2 Reglas generales

- Los tokens semánticos cambian; los primitivos **nunca** se usan directamente en componentes.
- Imágenes o ilustraciones: usar `filter: brightness(0.9)` en modo oscuro.
- Sombras en modo oscuro: preferir `border` sobre `box-shadow` para mayor legibilidad.
- No invertir íconos — Lucide funciona bien en ambos modos con `currentColor`.

### 8.3 Toggle de tema

```tsx
// Componente en la sidebar (user row)
// Íconos: Sun (claro) | Moon (oscuro)
// Tamaño: Button ghost size="sm" con ícono 16px
```

---

## 9. Tailwind Config — Extensiones

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          primary:  'var(--brand-primary)',
          subtle:   'var(--brand-primary-subtle)',
          hover:    'var(--brand-primary-hover)',
          secondary:'var(--brand-secondary)',
        },
        surface: {
          base:    'var(--surface-base)',
          raised:  'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          border:  'var(--surface-border)',
        },
      },
      borderRadius: {
        sm:   '4px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
      },
      boxShadow: {
        sm:  'var(--shadow-sm)',
        md:  'var(--shadow-md)',
        lg:  'var(--shadow-lg)',
        xl:  'var(--shadow-xl)',
      },
      keyframes: {
        'modal-in': {
          from: { opacity: '0', transform: 'scale(0.95) translateY(4px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'modal-in': 'modal-in 200ms ease-out',
        'toast-in': 'toast-in 200ms ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
```

---

## 10. Checklist de Implementación

Antes de marcar un componente como listo, verificar:

- [ ] Usa tokens semánticos (`var(--...)`) — no colores hardcoded
- [ ] Funciona en modo claro y oscuro
- [ ] Tiene estado de focus accesible (`focus-visible:outline`)
- [ ] Estado disabled implementado y visualmente diferenciado
- [ ] Responsivo: probado en 375px (mobile) y 1280px (desktop)
- [ ] Skeletons de loading listos antes del fetch
- [ ] Estado vacío definido para listas
- [ ] Íconos Lucide con `strokeWidth={1.5}` y tamaño correcto al contexto
- [ ] Animaciones respetan `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*Este documento es la única fuente de verdad visual. Cualquier desviación debe aprobarse y reflejarse aquí antes de implementarse.*
