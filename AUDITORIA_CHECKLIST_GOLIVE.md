# Checklist de Go-Live — NutriLink
**Fecha auditoría:** 2026-06-23

---

## 🔴 CRÍTICOS (bloqueantes)

- [x] **Fix #1** — `checkout.ts` ahora incluye `patient_id` en el INSERT de `orders` _(aplicado en esta auditoría)_
- [x] **Fix #2** — `/api/dev-setup` eliminado del codebase _(eliminado en esta auditoría)_
- [x] **Fix #3** — `wholesale_cost` removido del catálogo de profesionales _(aplicado en esta auditoría)_

---

## 🟠 ALTOS (bloqueantes)

- [x] **Fix #4** — Migración 005 aplicada: UNIQUE en `payments.provider_payment_id` _(idempotencia de webhook)_
- [x] **Fix #5** — Migración 005 aplicada: RLS policies para `order_items`, `payments`, `shipments`, `refills`
- [x] **Fix #6** — Rate limiting básico en `/api/chat/nutriguia` (longitud máx. mensajes)
- [ ] **Pendiente manual** — Validar IPs de origen en webhook de Flow (whitelist de IPs de Flow Chile)
- [ ] **Pendiente manual** — Rate limiting en `/api/chat/nutricoach` para usuarios autenticados

---

## 🟡 MEDIOS

- [x] **Fix #7** — Headers de seguridad HTTP agregados en `next.config.ts` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- [x] **Fix #8** — Migración 005: FKs de `agent_conversations` cambiadas a ON DELETE SET NULL
- [x] **Fix #9** — Migración 005: Índices duplicados en `plans.public_token` eliminados
- [x] **Fix #10** — Migración 005: `disclaimer_accepted_at TIMESTAMPTZ` agregado a `plans`
- [ ] **Pendiente MVP v1.1** — Tabla `commissions` separada para liquidaciones contables

---

## Variables de entorno en Vercel (PENDIENTE MANUAL)

| Variable | Estado |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ⬜ Configurar en Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⬜ Configurar en Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | ⬜ Configurar en Vercel (solo servidor) |
| `NEXT_PUBLIC_APP_URL` | ⬜ Configurar con dominio de producción |
| `FLOW_API_KEY` | ⬜ Configurar en Vercel |
| `FLOW_SECRET_KEY` | ⬜ Configurar en Vercel |
| `FLOW_API_URL` | ⬜ Cambiar a `https://www.flow.cl/app/web/services/rest/v4` (producción) |
| `RESEND_API_KEY` | ⬜ Configurar en Vercel |
| `CRON_SECRET` | ⬜ Generar con `openssl rand -hex 32` |
| `GROQ_API_KEY` | ⬜ Configurar en Vercel (portal profesional y paciente) |
| `ADMIN_EMAIL` | ⬜ Configurar en Vercel |

---

## Configuración adicional (PENDIENTE MANUAL)

- [ ] Configurar dominio personalizado en Vercel (nutrilink.cl)
- [ ] Agregar `NEXT_PUBLIC_APP_URL=https://nutrilink.cl` en Vercel
- [ ] Configurar Resend con dominio verificado `@nutrilink.cl`
- [ ] Crear usuario admin con email/password seguro (NO usar admin1)
- [ ] Cambiar Flow de sandbox a producción cuando se tenga contrato
- [ ] Configurar URL del webhook en el panel de Flow: `https://nutrilink.cl/api/payments/flow-webhook`
- [ ] Verificar cron job en Vercel Dashboard (renewal-check)
- [ ] Agregar primera nutricionista como usuario demo verificado

---

## Verificaciones técnicas

- [x] Build exitoso: 26 páginas, 0 errores TypeScript
- [x] RLS habilitado en las 15 tablas
- [x] Tokens de plan: 64 chars hex (entropía suficiente)
- [x] UNIQUE constraint en `plans.public_token`
- [x] Cero tokens duplicados en la base de datos
- [x] `SUPABASE_SERVICE_ROLE_KEY` solo en archivos server-side
- [x] `GROQ_API_KEY` solo en archivos server-side
- [x] `FLOW_SECRET_KEY` solo en archivos server-side
- [x] Precios calculados server-side en checkout
- [x] Webhook usa service role (bypass RLS correcto)
- [x] Checkout usa service role (bypass RLS correcto)
- [ ] Test E2E del flujo completo en modo sandbox de Flow
- [ ] Test IDOR: profesional A no puede ver datos del profesional B
- [ ] Webhook de Flow probado con tarjeta de prueba

---

## Estado final

**Críticos:** 3/3 ✅  
**Altos:** 4/6 ✅ (2 pendientes manuales)  
**Medios:** 4/5 ✅ (1 pendiente para v1.1)  
**Infraestructura de producción:** pendiente configuración en Vercel  

**Veredicto:** Listo para deploy en Vercel. Pendiente configurar variables de entorno y realizar test E2E con sandbox de Flow antes de aceptar pagos reales.
