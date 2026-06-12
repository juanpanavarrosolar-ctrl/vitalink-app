# Design System NutriLink

El sistema de diseño está definido en `app/globals.css` con CSS custom properties.

## Paleta de colores

### Primary — Health Green
- `--green-600: #059669` — Color primario, botones CTA
- `--green-700: #047857` — Hover de botones primarios
- `--green-50: #ECFDF5` — Fondos sutiles

### Accent — Blue
- `--blue-600: #2563EB` — Acento, links, badges informativos

### Neutros — Slate
- `--slate-900: #0F172A` — Texto principal, sidebar
- `--slate-500: #64748B` — Texto secundario
- `--slate-200: #E2E8F0` — Bordes
- `--slate-50: #F8FAFC` — Background de la app

### Semánticos
- Emerald → éxito, activo, alta adherencia
- Amber → advertencia, por renovar
- Red → error, en riesgo, vencido
- Violet → suscripciones

## Tipografía

**Fuente:** Plus Jakarta Sans · Pesos: 400, 500, 600, 700, 800

| Variable | Tamaño | Uso |
|----------|--------|-----|
| `--text-xs` | 0.6875rem | Labels, badges |
| `--text-sm` | 0.8125rem | Cuerpo tablas |
| `--text-base` | 0.875rem | Cuerpo principal |
| `--text-2xl` | 1.5rem | Títulos de página |

## Componentes UI (components/ui/)

- **Button**: variantes primary/secondary/ghost/danger/success, tamaños xs/sm/md/lg
- **Badge**: colores blue/emerald/amber/red/violet/slate, prop `dot`
- **Avatar**: genera color único por nombre via hue rotation
- **Icon**: 40+ SVG Heroicons stroke
- **Input**: con label, icon, focus ring con shadow-ring

## Espaciado (grid 4px)
`--sp-1: 4px` a `--sp-20: 80px`

## Sidebar
- Fondo: `--slate-900`
- Ancho: `248px`
- Nav activo: `rgba(16,185,129,0.12)` con texto `--green-400`
