# AUDITORÍA TÉCNICA NUTRILINK — Resultados
**Fecha:** 2026-06-23 | **Auditor:** Claude Code (Security + Fullstack + DBA)

---

## Resumen de Hallazgos

| Severidad | Cantidad |
|-----------|----------|
| 🔴 CRÍTICO | 3 |
| 🟠 ALTO | 6 |
| 🟡 MEDIO | 5 |
| 🔵 BAJO | 5 |
| ⚪ INFO | 3 |

---

## 🔴 CRÍTICOS

---

### [CRÍTICO #1] — checkout.ts no inserta `patient_id` → Checkout ROTO
- **Ubicación:** `lib/actions/checkout.ts:57-79`
- **Descripción:** `orders.patient_id` es `NOT NULL` en el schema, pero el INSERT en `initiateCheckout()` no incluye `patient_id`. El query select del plan tampoco trae `patient_id`.
- **Impacto:** Toda compra falla con error PostgreSQL `null value in column "patient_id" of relation "orders" violates not-null constraint`. El flujo de pago está completamente roto.
- **Acción correctiva:**
```typescript
// En checkout.ts, en el select del plan agregar patient_id:
.select('id, title, status, professional_id, patient_id, professionals(...), plan_items(...)')

// En el INSERT de orders agregar:
patient_id: plan.patient_id,
```

---

### [CRÍTICO #2] — `/api/dev-setup` accesible en producción con credenciales débiles
- **Ubicación:** `app/api/dev-setup/route.ts`
- **Descripción:** Ruta GET pública sin autenticación que crea usuarios con credenciales hardcodeadas: `admin@nutrilink.cl / admin1` y `nutri@nutrilink.cl / nutri1`. Usa `SUPABASE_SERVICE_ROLE_KEY` para crear cuentas admin.
- **Impacto:** Cualquier persona que conozca la URL puede crear una cuenta admin en producción, tomar control total del sistema, ver datos de todos los usuarios y acceder al panel admin. Vulnerabilidad crítica de toma de control.
- **Acción correctiva:** Eliminar el archivo completamente antes de hacer deploy a producción. Es un artefacto de desarrollo que nunca debe existir en producción.

---

### [CRÍTICO #3] — `wholesale_cost` expuesto al portal profesional
- **Ubicación:** `app/(professional)/catalog/page.tsx:9` y `catalog-view.tsx:17`
- **Descripción:** El query de catálogo incluye `wholesale_cost` en el SELECT y el tipo `Product` en `catalog-view.tsx` expone este campo. El costo de compra al proveedor es visible para los profesionales.
- **Impacto:** Los profesionales pueden ver el margen de ganancia de NutriLink comparando `price` vs `wholesale_cost`. Daño comercial, pérdida de poder de negociación, posibles disputas éticas.
- **Acción correctiva:** Eliminar `wholesale_cost` del SELECT y del tipo Product del catálogo.

---

## 🟠 ALTOS

---

### [ALTO #4] — Webhook Flow sin validación de origen → idempotencia rota
- **Ubicación:** `app/api/payments/flow-webhook/route.ts`
- **Descripción:** El webhook no valida que la request provenga de Flow (sin firma HMAC). Tampoco existe constraint UNIQUE en `payments.provider_payment_id`, por lo que si Flow llama dos veces con el mismo token, se crea un registro de pago duplicado y se marca la orden como pagada dos veces.
- **Impacto:** (a) Un atacante puede llamar al webhook repetidamente si conoce un token válido. (b) Doble procesamiento si Flow reintenta. (c) El lookup de pago por `provider_payment_id` hace full table scan (no hay índice).
- **Acción correctiva:** Ver `AUDITORIA_FIXES.md` — migración 005 + validación de origen en el webhook.

---

### [ALTO #5] — RLS: `order_items`, `payments`, `shipments`, `refills` sin políticas
- **Ubicación:** Supabase — tablas `order_items`, `payments`, `shipments`, `refills`
- **Descripción:** Estas 4 tablas tienen RLS habilitado pero CERO políticas definidas. En PostgreSQL, RLS habilitado sin políticas = BLOQUEO TOTAL para cualquier usuario autenticado vía anon key. Solo el service role puede acceder.
- **Impacto:** Si alguna ruta usa el cliente autenticado (no service role) para acceder a estas tablas, recibe 0 filas sin error. El paciente nunca puede ver sus envíos. Silencioso e indetectable en desarrollo.
- **Acción correctiva:** Ver `AUDITORIA_FIXES.md` — migración 005 con políticas RLS.

---

### [ALTO #6] — `orders_own_patient` RLS es incorrecto
- **Ubicación:** Supabase — política `orders_own_patient` en tabla `orders`
- **Descripción:** La política actual:
  ```sql
  patient_id IN (SELECT patients.id FROM patients 
    WHERE patients.professional_id IN (
      SELECT professionals.id FROM professionals 
      WHERE professionals.user_id = auth.uid()))
  ```
  Esto da acceso a órdenes **al profesional** a través de la cadena paciente, NO al paciente autenticado. El nombre "own_patient" es engañoso. Los pacientes no tienen user accounts separados en el sistema actual, pero la política no hace lo que dice.
- **Impacto:** Un profesional puede ver todas las órdenes de sus pacientes (intencional), pero el nombre sugiere acceso del paciente que no existe. Confusión semántica que puede llevar a bugs futuros.
- **Acción correctiva:** Renombrar a `orders_professional_patients_select` y documentar claramente.

---

### [ALTO #7] — No hay índice en `payments.provider_payment_id`
- **Ubicación:** Tabla `payments`, columna `provider_payment_id`
- **Descripción:** El webhook hace `SELECT ... WHERE provider_payment_id = token`. No hay índice en esta columna. Con miles de pagos, esto es un full table scan en cada webhook.
- **Impacto:** Latencia creciente en el webhook de pago. Flow tiene timeout de 10s. Si la query tarda > 10s, Flow marca el pago como fallido y reintenta, amplificando el problema.
- **Acción correctiva:** Agregar índice + constraint UNIQUE (ver migración 005).

---

### [ALTO #8] — `orders.professional_id` FK sin regla ON DELETE
- **Ubicación:** Tabla `orders`, FK a `professionals`
- **Descripción:** La FK `orders.professional_id → professionals.id` tiene `delete_rule: NO ACTION`. Si se elimina un profesional, las órdenes quedan con un `professional_id` que apunta a nada. PostgreSQL bloqueará la eliminación, pero el error será críptico.
- **Impacto:** Imposible eliminar profesionales que tengan órdenes. No hay mensaje de error descriptivo para el admin.
- **Acción correctiva:** Cambiar a `ON DELETE SET NULL` y asegurarse de que `professional_id` permita NULL.

---

### [ALTO #9] — `/api/chat/nutriguia` sin autenticación ni rate limiting
- **Ubicación:** `app/api/chat/nutriguia/route.ts`
- **Descripción:** El endpoint no requiere ningún tipo de autenticación. Cualquier persona puede llamarlo infinitamente, agotando el cupo gratuito de Groq (14,400 req/día) o generando costos si se pasa al tier pagado.
- **Impacto:** Denegación de servicio del agente IA para todos los pacientes reales. Posible costo económico si la API de Groq se pasa al tier pagado.
- **Acción correctiva:** Ver `AUDITORIA_FIXES.md` — agregar rate limiting por IP + validar que `planToken` sea un token de plan real antes de llamar a Groq.

---

## 🟡 MEDIOS

---

### [MEDIO #10] — Índices duplicados en `plans.public_token`
- **Ubicación:** Tabla `plans`
- **Descripción:** Existen tres objetos que indexan `public_token`: `idx_plans_public_token`, `idx_plans_token`, y el UNIQUE constraint `plans_public_token_key`. Dos índices son redundantes.
- **Impacto:** Cada INSERT/UPDATE en `plans` actualiza 3 índices en lugar de 1. Degradación de rendimiento en escrituras. Espacio desperdiciado.
- **Acción correctiva:** Eliminar los dos índices no-unique: `DROP INDEX idx_plans_public_token; DROP INDEX idx_plans_token;`

---

### [MEDIO #11] — `agent_conversations` FKs con NO ACTION
- **Ubicación:** Tabla `agent_conversations`, columnas `patient_id` y `plan_id`
- **Descripción:** Las FKs a `patients` y `plans` tienen `delete_rule: NO ACTION`. Si se elimina un paciente o plan, las referencias en `agent_conversations` quedan huérfanas y PostgreSQL bloquea la eliminación.
- **Impacto:** Imposible eliminar pacientes o planes que tengan conversaciones de IA.
- **Acción correctiva:** Cambiar a `ON DELETE SET NULL` (ambas columnas ya permiten NULL).

---

### [MEDIO #12] — Tabla `commissions` ausente
- **Ubicación:** Supabase schema
- **Descripción:** No existe tabla `commissions` separada. Las comisiones solo están en `orders.commission_pct/amt`. No hay histórico de liquidaciones al profesional.
- **Impacto:** El profesional no puede ver un historial de comisiones liquidadas vs pendientes. La página `/finance` calcula comisiones desde órdenes, no desde registros de liquidación. Imposible hacer reconciliación contable.
- **Acción correctiva:** Para MVP es aceptable. Para v1.1 crear tabla `commissions` con estado de liquidación.

---

### [MEDIO #13] — Falta validación de origen del webhook de Flow
- **Ubicación:** `app/api/payments/flow-webhook/route.ts`
- **Descripción:** Flow no envía firma HMAC en sus webhooks (usa modelo "notificación → pull"). El endpoint actual es correcto en llamar a `getFlowPaymentStatus` para verificar el estado real. Sin embargo, el endpoint no valida la IP de origen de Flow ni tiene rate limiting.
- **Impacto:** DDoS posible al endpoint con tokens reales, causando miles de llamadas a la Flow API.
- **Acción correctiva:** Agregar rate limiting por IP. Opcionalmente whitelist IPs de Flow.

---

### [MEDIO #14] — No hay Content-Security-Policy ni headers de seguridad
- **Ubicación:** `next.config.ts` (ausente o incompleto)
- **Descripción:** No se configuraron headers de seguridad HTTP: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **Impacto:** Posible clickjacking. Posible inyección de contenido via iframes. Sin CSP, cualquier XSS tiene mayor impacto.
- **Acción correctiva:** Ver `AUDITORIA_FIXES.md` — headers de seguridad en next.config.ts.

---

## 🔵 BAJOS

---

### [BAJO #15] — `orders.commission_pct/amt` como INTEGER
- **Ubicación:** Tabla `orders`, columnas `commission_pct`, `commission_amt`
- **Descripción:** Las comisiones están almacenadas como INTEGER. `commission_pct = 15` significa 15%, pero si un profesional tiene descuento fijo (discount_mode = 'fixed'), no hay lugar para almacenar el monto exacto en pesos con decimales.
- **Impacto:** Redondeo de comisiones. Para CLP (sin centavos) es aceptable. No bloquea MVP.
- **Acción correctiva:** Cambiar a NUMERIC(10,0) en una migración futura si se implementan comisiones en UF.

---

### [BAJO #16] — Sin rate limiting en `/api/chat/nutricoach`
- **Ubicación:** `app/api/chat/nutricoach/route.ts`
- **Descripción:** Aunque el endpoint requiere autenticación (protección suficiente), un profesional autenticado podría hacer spam de requests y agotar el cuota de Groq.
- **Impacto:** Degradación del servicio de IA para otros usuarios.
- **Acción correctiva:** Agregar límite de N mensajes por usuario por hora via Redis o memoria.

---

### [BAJO #17] — `agent_messages` RLS sin WITH CHECK explícito
- **Ubicación:** Política `user_own_messages` en tabla `agent_messages`
- **Descripción:** La política no tiene `WITH CHECK` explícito. PostgreSQL usa el `USING` para INSERT en este caso, lo que es correcto, pero es confuso para auditorías futuras.
- **Impacto:** Funcionalmente correcto. Riesgo futuro de confusión.
- **Acción correctiva:** Agregar `WITH CHECK` explícito igual al USING.

---

### [BAJO #18] — `proxy.ts` no protege `/register` y `/onboarding`
- **Ubicación:** `proxy.ts:29`
- **Descripción:** Las rutas `/register` y `/onboarding` no están en la lista de rutas públicas ni protegidas. Un usuario autenticado que va a `/register` no es redirigido a su dashboard.
- **Impacto:** UX: un profesional logueado puede ver la página de registro. No es un problema de seguridad.
- **Acción correctiva:** Agregar lógica: si `user` está logueado y va a `/register` o `/login`, redirigir a su portal correspondiente.

---

### [BAJO #19] — `disclaimer_accepted` sin timestamp ni auditoría
- **Ubicación:** Tabla `plans`, columna `disclaimer_accepted BOOLEAN`
- **Descripción:** El disclaimer regulatorio DS 977 se registra como booleano. No hay timestamp de cuándo se aceptó, ni IP, ni user agent.
- **Impacto:** En caso de disputa regulatoria, NutriLink no puede probar cuándo el paciente aceptó el disclaimer.
- **Acción correctiva:** Agregar `disclaimer_accepted_at TIMESTAMPTZ` a la tabla `plans`.

---

## ⚪ INFO

---

### [INFO #20] — Nomenclatura `plans`/`plan_items` vs `protocols`/`protocol_items`
- **Ubicación:** Todo el schema
- **Descripción:** El documento de auditoría espera tablas llamadas `protocols` y `protocol_items`. El schema real usa `plans` y `plan_items`. La funcionalidad es idéntica.
- **Impacto:** Solo afecta la lectura del código si alguien busca "protocol".
- **Acción correctiva:** Documentar el naming en README.

---

### [INFO #21] — Tabla `commissions` no implementada
- **Ubicación:** Schema Supabase
- **Descripción:** El documento de auditoría la lista como esperada. No existe. Funcionalidad de comisiones está embebida en `orders`.
- **Impacto:** Ninguno en MVP. Limitación para contabilidad avanzada.

---

### [INFO #22] — `professionals.profession` vs `specialty` naming
- **Ubicación:** Tabla `professionals`
- **Descripción:** Hay dos columnas de categoría: `profession` (NOT NULL) y `specialty` (nullable). El frontend usa `specialty` en varios lugares. `profession` es requerido pero el registro solo pide `specialty`.
- **Impacto:** Registros con `profession` vacío pueden romper queries futuras que filtren por profesión.
- **Acción correctiva:** En `app/register/page.tsx`, mapear el campo de especialidad a `profession` también.

---

## Verificaciones OK ✓

- ✅ RLS habilitado en las 15 tablas del schema
- ✅ Tokens de plan: `encode(gen_random_bytes(32), 'hex')` = 64 chars hex (entropía suficiente)
- ✅ UNIQUE constraint en `plans.public_token` 
- ✅ Cero tokens duplicados en planes
- ✅ `SUPABASE_SERVICE_ROLE_KEY` solo en server-side (ningún archivo `NEXT_PUBLIC_*`)
- ✅ `GROQ_API_KEY` solo en server-side
- ✅ `FLOW_SECRET_KEY` solo en server-side (lib/flow.ts)
- ✅ Build exitoso: 27 páginas, 0 errores TypeScript
- ✅ `products.price` es NUMERIC (no FLOAT)
- ✅ Todos los campos `id` son UUID con `gen_random_uuid()`/`uuid_generate_v4()`
- ✅ Middleware (proxy.ts) protege rutas por rol correctamente
- ✅ `orders.status` enum tiene 'paid', 'failed', 'pending_payment' — webhook compatible
- ✅ checkout.ts usa service role (no expone datos vía RLS)
- ✅ webhook usa service role
- ✅ `.gitignore` excluye `.env`, `.env.local`
- ✅ HTTPS activo en Vercel (automático)
- ✅ Precios calculados server-side (no se confía en el cliente)
