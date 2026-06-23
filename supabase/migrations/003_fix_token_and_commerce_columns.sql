-- Migration 003: Fix public_token length + add Flow commerce columns

-- 1. Fix public_token: 16 bytes (32 chars) → 32 bytes (64 chars hex)
ALTER TABLE public.plans
  ALTER COLUMN public_token SET DEFAULT encode(gen_random_bytes(32), 'hex');

-- 2. Add expires_at default (30 days from now) for new plans
ALTER TABLE public.plans
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '30 days');

-- 3. Add professional_id to orders for direct lookup
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS professional_id uuid REFERENCES public.professionals(id);

-- 4. Add Flow payment columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS flow_order_id    text,
  ADD COLUMN IF NOT EXISTS flow_payment_url text,
  ADD COLUMN IF NOT EXISTS commission_pct   integer NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS commission_amt   integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS patient_email    text,
  ADD COLUMN IF NOT EXISTS patient_name     text,
  ADD COLUMN IF NOT EXISTS paid_at          timestamptz;

-- 5. Add raw_webhook to payments for Flow webhook storage
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS raw_webhook jsonb;

-- 6. Add professional SELECT policy for orders (by professional_id)
CREATE POLICY "orders_professional_select" ON public.orders
  FOR SELECT USING (
    professional_id IN (
      SELECT id FROM public.professionals WHERE user_id = auth.uid()
    )
  );

-- 7. is_admin() function (uses public.users table role)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.users WHERE id = auth.uid()),
    false
  )
$$;

-- 8. Admin policy: read all professionals
CREATE POLICY "professionals_admin_select" ON public.professionals
  FOR SELECT USING (public.is_admin());

-- 9. Admin policy: read all orders
CREATE POLICY "orders_admin_select" ON public.orders
  FOR SELECT USING (public.is_admin());

-- 10. Admin policy: manage all products
CREATE POLICY "products_admin_all" ON public.products
  FOR ALL USING (public.is_admin());

-- 11. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_professional ON public.orders(professional_id);
CREATE INDEX IF NOT EXISTS idx_orders_flow_order   ON public.orders(flow_order_id);
CREATE INDEX IF NOT EXISTS idx_plans_token          ON public.plans(public_token);
CREATE INDEX IF NOT EXISTS idx_plans_professional   ON public.plans(professional_id, status);
