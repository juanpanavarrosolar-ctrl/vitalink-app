# Deploy en Vercel

## Requisitos previos

1. Cuenta en [vercel.com](https://vercel.com)
2. Repositorio `nutrilink-app` en GitHub
3. Proyecto en Supabase con schema aplicado

## Paso 1: Conectar GitHub a Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Selecciona **"Import Git Repository"**
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Busca `nutrilink-app` y haz clic en **Import**
5. Vercel detecta Next.js automáticamente — no cambies nada en el framework preset

## Paso 2: Configurar variables de entorno

Antes de hacer el primer deploy, agrega las variables en **Settings > Environment Variables**:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://nutrilink-app.vercel.app` | Production |

> Puedes encontrar estas keys en Supabase Dashboard > Settings > API

## Paso 3: Deploy

Haz clic en **Deploy**. El primer build tarda ~2 minutos.

Una vez exitoso, Vercel te da una URL como `https://nutrilink-app.vercel.app`.

## Paso 4: CI/CD automático

Desde ahora, cada `git push` a `main` triggerea un deploy automático. Los PRs generan **preview URLs** independientes.

## Paso 5: Dominio personalizado (opcional)

En **Settings > Domains**, agrega tu dominio y sigue las instrucciones de DNS.

## Troubleshooting

**Build falla con "NEXT_PUBLIC_SUPABASE_URL is not defined":**
→ Verifica que las variables de entorno están configuradas en Vercel (no solo en `.env.local`)

**Middleware redirect loop:**
→ Asegúrate que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son correctos

**Error 500 en rutas de API:**
→ Revisa los logs en Vercel Dashboard > Functions
