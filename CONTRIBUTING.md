# Contribución a NutriLink

## Setup de desarrollo

### Requisitos
- Node.js 18+
- npm 9+
- Cuenta en Supabase (free tier es suficiente)
- Cuenta en Vercel (para deploy)

### Pasos

1. Clona el repo y corre `npm install`
2. Copia `.env.example` a `.env.local` y completa las variables
3. Aplica el schema SQL en Supabase (ver `supabase/README.md`)
4. Corre `npm run dev`

## Convenciones de código

- **TypeScript estricto**: `tsconfig.json` con `strict: true`
- **Componentes**: Archivos `.tsx` en `components/`. Server components por defecto, `'use client'` solo cuando necesario (interactividad, hooks)
- **Estilos**: CSS inline con variables del design system (`var(--color-primary)`, etc.). Sin Tailwind, sin CSS Modules por ahora
- **Rutas API**: `app/api/` para mutaciones. Usar Supabase server client con service role
- **No commitear `.env.local`**: Las keys de Supabase nunca van al repo

## Estructura de ramas

```
main          ← producción (deploy automático en Vercel)
feat/*        ← features nuevas
fix/*         ← bug fixes
```

## Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo server-side) |
| `NEXT_PUBLIC_APP_URL` | URL de la app (localhost en dev) |

## Features pendientes (issues abiertos)

Ver GitHub Issues para el backlog del MVP. Las más urgentes:
1. Conectar Supabase real (reemplazar mock data)
2. Flujo de pago Webpay
3. Notificaciones WhatsApp
4. AI Assistant
