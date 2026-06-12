# NutriLink — Plataforma para Nutricionistas

NutriLink es una plataforma web que permite a nutricionistas crear y gestionar protocolos de suplementación personalizados para sus pacientes, con e-commerce integrado, suscripciones automáticas y métricas de adherencia.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 · App Router · TypeScript |
| Estilos | CSS Variables (design system custom) · Plus Jakarta Sans |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Deploy | Vercel |

## Estructura del proyecto

```
nutrilink-app/
├── app/
│   ├── (professional)/       # Vistas del nutricionista (protegidas)
│   │   ├── dashboard/
│   │   ├── protocols/
│   │   ├── patients/
│   │   ├── catalog/
│   │   ├── finance/
│   │   └── settings/
│   ├── (patient)/
│   │   └── p/[token]/        # Vista pública del paciente (short link)
│   ├── login/
│   └── auth/callback/
├── components/
│   ├── ui/                   # Button, Badge, Avatar, Icon, Input
│   └── shell/                # Sidebar navigation
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── mock-data.ts          # Datos demo (→ reemplazar con Supabase)
│   └── supabase/             # Browser + server clients
├── supabase/
│   ├── migrations/001_initial_schema.sql
│   ├── seed.sql
│   └── README.md
└── middleware.ts             # Protección de rutas con Supabase Auth
```

## Setup local

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/nutrilink-app.git
cd nutrilink-app
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase (ver `supabase/README.md`).

### 4. Aplica el schema de Supabase

Sigue las instrucciones en [`supabase/README.md`](supabase/README.md).

### 5. Corre en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> **Nota:** Sin variables de Supabase configuradas, la app usa mock data y el middleware de auth está desactivado.

## Deploy en Vercel

Ver [`docs/deployment.md`](docs/deployment.md) para instrucciones paso a paso.

## Módulos del MVP

| Módulo | Ruta | Estado |
|--------|------|--------|
| Dashboard | `/dashboard` | ✅ MVP |
| Protocolos | `/protocols` | ✅ MVP |
| Pacientes | `/patients` | ✅ MVP |
| Catálogo | `/catalog` | ✅ MVP |
| Finanzas | `/finance` | ✅ MVP |
| Configuración | `/settings` | ✅ MVP |
| Vista paciente | `/p/[token]` | ✅ MVP |
| AI Assistant | — | 🚧 Próximamente |
| Pagos (Webpay) | — | 🚧 Próximamente |
| WhatsApp | — | 🚧 Próximamente |

## Design System

El sistema de diseño está definido en [`app/globals.css`](app/globals.css) con CSS variables. Ver [`docs/design-system.md`](docs/design-system.md) para la documentación completa.

**Paleta principal:**
- Primary: Health Green (`--green-600: #059669`)
- Accent: Blue (`--blue-600: #2563EB`)
- Neutros: Slate gray scale

## Contribución

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md).
