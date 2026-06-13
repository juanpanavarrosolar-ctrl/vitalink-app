-- NutriLink Seed Data
-- Matches the 13-table schema applied during initial setup
--
-- SETUP STEPS:
-- 1. Create auth user via Supabase signUp (NOT direct SQL insert):
--    Email: demo@nutrilink.cl / Password: Nutrilink2024!
--    Metadata: {"name": "Dra. Catalina Reyes", "role": "professional"}
--    The handle_new_user() trigger auto-creates public.users.
--
-- 2. Confirm the email (dev only):
--    UPDATE auth.users
--    SET email_confirmed_at = now(), confirmation_token = ''
--    WHERE email = 'demo@nutrilink.cl';
--
-- 3. Run this script replacing <USER_UUID> with the real auth user UUID.

DO $$
DECLARE
  v_user_id uuid := '<USER_UUID>';  -- Replace with auth.users.id
  v_prof_id uuid;
  v_sup_id  uuid;
  v_p1 uuid; v_p2 uuid; v_p3 uuid; v_p4 uuid;
  v_pat1 uuid; v_pat2 uuid; v_pat3 uuid;
  v_plan1 uuid; v_plan2 uuid;
BEGIN

  -- Professional profile
  INSERT INTO public.professionals
    (user_id, full_name, profession, license_number, specialty, clinic_name,
     verification_status, discount_mode, discount_value)
  VALUES
    (v_user_id, 'Dra. Catalina Reyes', 'Nutricionista', 'RUT 12.345.678-9',
     'Nutrición Clínica y Deportiva', 'Centro Bienestar Integral',
     'verified', 'percentage', 15)
  RETURNING id INTO v_prof_id;

  -- Supplier
  INSERT INTO public.suppliers (name, type, contact_email, status)
  VALUES ('Lab Natura Chile', 'local', 'ventas@labnatura.cl', 'active')
  RETURNING id INTO v_sup_id;

  -- Products
  INSERT INTO public.products (supplier_id, name, brand, compound, format, dosage,
    unit_count, price, wholesale_cost, stock_status, claim_review_status, description_safe)
  VALUES (v_sup_id, 'Omega-3 1000mg', 'Lab Natura', 'EPA 600mg + DHA 400mg',
    'Cápsula blanda', '1000mg', 90, 32990, 18000, 'active', 'approved',
    'Ácidos grasos esenciales para función cardiovascular y cognitiva.')
  RETURNING id INTO v_p1;

  INSERT INTO public.products (supplier_id, name, brand, compound, format, dosage,
    unit_count, price, wholesale_cost, stock_status, claim_review_status, description_safe)
  VALUES (v_sup_id, 'Vitamina D3 2000 UI', 'Lab Natura', 'Colecalciferol',
    'Cápsula', '2000 UI', 60, 18990, 9000, 'active', 'approved',
    'Vitamina D3 para huesos, sistema inmune y niveles de energía.')
  RETURNING id INTO v_p2;

  INSERT INTO public.products (supplier_id, name, brand, compound, format, dosage,
    unit_count, price, wholesale_cost, stock_status, claim_review_status, description_safe)
  VALUES (v_sup_id, 'Magnesio Bisglicinato 300mg', 'Lab Natura', 'Bisglicinato de Magnesio',
    'Cápsula', '300mg', 60, 24990, 13000, 'active', 'approved',
    'Magnesio altamente biodisponible para descanso y función muscular.')
  RETURNING id INTO v_p3;

  INSERT INTO public.products (supplier_id, name, brand, compound, format, dosage,
    unit_count, price, wholesale_cost, stock_status, claim_review_status, description_safe)
  VALUES (v_sup_id, 'Zinc Citrato 25mg', 'Lab Natura', 'Citrato de Zinc',
    'Tableta', '25mg', 60, 14990, 7000, 'active', 'approved',
    'Zinc de alta biodisponibilidad para sistema inmune y metabolismo.')
  RETURNING id INTO v_p4;

  -- Patients
  INSERT INTO public.patients (professional_id, name, email, phone, birth_year, consent_status)
  VALUES (v_prof_id, 'María González', 'maria.gonzalez@email.com', '+56 9 1234 5678', 1990, 'accepted')
  RETURNING id INTO v_pat1;

  INSERT INTO public.patients (professional_id, name, email, phone, birth_year, consent_status)
  VALUES (v_prof_id, 'Carlos Mendoza', 'carlos.mendoza@email.com', '+56 9 8765 4321', 1985, 'accepted')
  RETURNING id INTO v_pat2;

  INSERT INTO public.patients (professional_id, name, email, phone, birth_year, consent_status)
  VALUES (v_prof_id, 'Valentina Torres', 'v.torres@email.com', '+56 9 5555 1234', 1995, 'pending')
  RETURNING id INTO v_pat3;

  -- Plan 1 — Energía & Recuperación (María)
  INSERT INTO public.plans (professional_id, patient_id, title, status, duration_days, notes)
  VALUES (v_prof_id, v_pat1, 'Protocolo Energía & Recuperación', 'sent', 90,
    'Optimización energética y recuperación muscular post-ejercicio.')
  RETURNING id INTO v_plan1;

  INSERT INTO public.plan_items (plan_id, product_id, quantity, instructions, frequency, duration_days) VALUES
    (v_plan1, v_p1, 1, 'Tomar con el almuerzo junto a alimentos grasos.', '1 vez al día', 90),
    (v_plan1, v_p2, 1, 'Tomar en la mañana con el desayuno.', '1 vez al día', 90),
    (v_plan1, v_p3, 1, 'Tomar antes de dormir.', '1 vez al día', 90);

  -- Plan 2 — Inmunidad & Bienestar (Carlos)
  INSERT INTO public.plans (professional_id, patient_id, title, status, duration_days, notes)
  VALUES (v_prof_id, v_pat2, 'Protocolo Inmunidad & Bienestar', 'accepted', 60,
    'Plan de soporte inmune de 60 días con evaluación al mes.')
  RETURNING id INTO v_plan2;

  INSERT INTO public.plan_items (plan_id, product_id, quantity, instructions, frequency, duration_days) VALUES
    (v_plan2, v_p2, 1, 'Tomar en la mañana con el desayuno.', '1 vez al día', 60),
    (v_plan2, v_p4, 1, 'Tomar al mediodía con alimentos.', '1 vez al día', 60);

END $$;
