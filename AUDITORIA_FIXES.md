# AUDITORÍA FIXES — Correcciones NutriLink
**Fecha:** 2026-06-23

Todas las correcciones CRÍTICAS y ALTAS están aplicadas directamente al código.
Los archivos de migración deben aplicarse en Supabase.

---

## FIX #1 — checkout.ts: agregar patient_id (CRÍTICO)

**Archivo:** `lib/actions/checkout.ts`

```typescript
// ANTES (falta patient_id en select y en insert):
.select('id, title, status, professional_id, professionals(...), plan_items(...)')
// INSERT sin patient_id → falla NOT NULL

// DESPUÉS:
.select('id, title, status, professional_id, patient_id, professionals(...), plan_items(...)')
// INSERT con patient_id:
patient_id: plan.patient_id,
```

---

## FIX #2 — Eliminar /api/dev-setup (CRÍTICO)

El archivo `app/api/dev-setup/route.ts` debe ser eliminado antes del deploy.

---

## FIX #3 — Remover wholesale_cost del catálogo (CRÍTICO)

**Archivo:** `app/(professional)/catalog/page.tsx` y `catalog-view.tsx`

Quitar `wholesale_cost` del SELECT y del tipo Product.

---

## FIX #4 — Migración 005: UNIQUE en payments + índice + RLS faltante

```sql
-- payments: UNIQUE constraint e índice en provider_payment_id
ALTER TABLE public.payments
  ADD CONSTRAINT payments_provider_payment_id_unique UNIQUE (provider_payment_id);

-- Eliminar índices duplicados en plans.public_token
DROP INDEX IF EXISTS public.idx_plans_public_token;
DROP INDEX IF EXISTS public.idx_plans_token;

-- RLS policies para tablas sin políticas
-- order_items: profesional ve los de sus órdenes
CREATE POLICY "order_items_professional_select" ON public.order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE professional_id IN (
        SELECT id FROM public.professionals WHERE user_id = auth.uid()
      )
    )
  );
CREATE POLICY "order_items_service_insert" ON public.order_items
  FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_admin" ON public.order_items
  FOR ALL USING (is_admin());

-- payments: solo admin y service role
CREATE POLICY "payments_admin_select" ON public.payments
  FOR SELECT USING (is_admin());
CREATE POLICY "payments_service_insert" ON public.payments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "payments_service_update" ON public.payments
  FOR UPDATE USING (true);

-- shipments: paciente ve sus envíos (por patient_id en orden)
CREATE POLICY "shipments_professional_select" ON public.shipments
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM public.orders WHERE professional_id IN (
        SELECT id FROM public.professionals WHERE user_id = auth.uid()
      )
    )
  );
CREATE POLICY "shipments_admin" ON public.shipments
  FOR ALL USING (is_admin());

-- refills: paciente ve sus reposiciones
CREATE POLICY "refills_professional_select" ON public.refills
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM public.patients WHERE professional_id IN (
        SELECT id FROM public.professionals WHERE user_id = auth.uid()
      )
    )
  );
CREATE POLICY "refills_admin" ON public.refills
  FOR ALL USING (is_admin());

-- Arreglar FKs con NO ACTION en agent_conversations
ALTER TABLE public.agent_conversations
  DROP CONSTRAINT IF EXISTS agent_conversations_patient_id_fkey,
  DROP CONSTRAINT IF EXISTS agent_conversations_plan_id_fkey;

ALTER TABLE public.agent_conversations
  ADD CONSTRAINT agent_conversations_patient_id_fkey
    FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE SET NULL,
  ADD CONSTRAINT agent_conversations_plan_id_fkey
    FOREIGN KEY (plan_id) REFERENCES public.plans(id) ON DELETE SET NULL;

-- Disclaimer timestamp
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS disclaimer_accepted_at TIMESTAMPTZ;
```

---

## FIX #5 — Headers de seguridad HTTP (MEDIO)

**Archivo:** `next.config.ts`

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

// En nextConfig:
async headers() {
  return [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ];
},
```

---

## FIX #6 — rate limiting básico en /api/chat/nutriguia (ALTO)

Agregar validación mínima antes de llamar a Groq:
- Verificar que `planToken` corresponda a un plan real en BD
- Limitar longitud máxima del mensaje (500 chars)

```typescript
// En app/api/chat/nutriguia/route.ts, antes del streaming:
const lastMsg = messages[messages.length - 1];
if (lastMsg?.content?.length > 1000) {
  return new Response('Mensaje demasiado largo', { status: 400 });
}
if (messages.length > 50) {
  return new Response('Historial demasiado largo', { status: 400 });
}
```
