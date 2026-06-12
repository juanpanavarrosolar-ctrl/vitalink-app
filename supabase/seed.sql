-- NutriLink MVP — Seed Data
-- Run AFTER 001_initial_schema.sql
-- Replace 'YOUR_AUTH_USER_ID' with the UUID from Supabase Auth > Users after creating your account

-- ============================================================
-- STEP 1: Create auth user first via Supabase Auth dashboard
-- Then replace the UUID below with the real user_id
-- ============================================================

do $$
declare
  v_pro_id   uuid;
  v_pat1_id  uuid;
  v_pat2_id  uuid;
  v_pat3_id  uuid;
  v_pat4_id  uuid;
  v_pat5_id  uuid;
  v_p01_id   uuid;
  v_p02_id   uuid;
  v_p03_id   uuid;
  v_p04_id   uuid;
  v_p05_id   uuid;
  v_p06_id   uuid;
  v_p07_id   uuid;
  v_p09_id   uuid;
  v_p10_id   uuid;
  v_p11_id   uuid;
  v_p12_id   uuid;
  v_prot1_id uuid;
  v_prot2_id uuid;
  v_prot3_id uuid;
  v_user_id  uuid;
begin

  -- Get or create the auth user (replace with real UUID after sign-up)
  -- You can find this UUID in Supabase Dashboard > Authentication > Users
  v_user_id := '00000000-0000-0000-0000-000000000001'::uuid;

  -- PROFESSIONAL
  insert into public.professionals (user_id, name, first_name, specialty, focus, email, phone, initials, college_reg, verified, margin_mode, margin_pct)
  values (v_user_id, 'Dra. María Torres', 'María', 'Nutricionista Clínica', 'Salud Metabólica Femenina', 'maria.torres@nutrilink.cl', '+56 9 8765 4321', 'MT', 'CSN-4521', true, 'transfer_to_patient', 15)
  returning id into v_pro_id;

  -- PRODUCTS (seed catalog — shared, no professional_id)
  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'INO-4000-IN', 'Inositol Myo 4g', 'Myo-Inositol', '4g', 'Integra Naturals', 'metabolico', 15990, 9594, 120, '2g mañana + 2g noche', array['GMP','NSF'], true, 45, 90, 'high', array['SOP','Resistencia Insulínica','Fertilidad'], 'Myo-Inositol puro para regulación hormonal y sensibilidad insulínica.')
  returning id into v_p01_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'MAG-400-NS', 'Magnesio Bisglicinato', 'Magnesio Bisglicinato', '400mg', 'NewScience', 'metabolico', 15990, 9594, 90, '1 cápsula antes de dormir', array['GMP'], true, 62, 90, 'high', array['Ansiedad','Sueño','SOP','Calambres'], 'Magnesio de alta biodisponibilidad, forma quelatada para absorción superior.')
  returning id into v_p02_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'OMG-1000-NN', 'Omega-3 EPA/DHA', 'Omega-3 (EPA 600 / DHA 400)', '1000mg', 'Nordic Naturals', 'metabolico', 18990, 11394, 60, '1 cápsula con almuerzo', array['IFOS','GMP'], true, 38, 90, 'high', array['Inflamación','Cardiovascular','SOP'], 'Aceite de pescado ultra-purificado con certificación IFOS 5 estrellas.')
  returning id into v_p03_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'VD3-2000-JR', 'Vitamina D3', 'Colecalciferol', '2000 UI', 'Jarrow Formulas', 'metabolico', 12990, 7794, 120, '1 cápsula con almuerzo', array['GMP','NSF'], true, 71, 90, 'high', array['Déficit Vitamínico','Inmunidad','Óseo'], 'Vitamina D3 colecalciferol para soporte inmunológico y óseo.')
  returning id into v_p04_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'ZNC-30-TR', 'Zinc Picolinato', 'Zinc Picolinato', '30mg', 'Thorne Research', 'metabolico', 11990, 7194, 60, '1 cápsula con cena', array['GMP','NSF','TGA'], true, 54, 90, 'high', array['Inmunidad','Hormonal','Acné'], 'Zinc picolinato de alta absorción para soporte inmune y hormonal.')
  returning id into v_p05_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'B12-1000-PE', 'Vitamina B12', 'Metilcobalamina', '1000mcg', 'Pure Encapsulations', 'metabolico', 14990, 8994, 90, '1 cápsula en ayunas', array['GMP','Hypoallergenic'], true, 48, 90, 'high', array['Déficit B12','Energía','Neurológico'], 'Metilcobalamina activa, forma biodisponible de vitamina B12.')
  returning id into v_p06_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'PRO-50B-KL', 'Probiótico Multi-cepa', 'Multi-cepa 50B CFU', '50B CFU', 'Klaire Labs', 'digestivo', 22990, 13794, 30, '1 cápsula en ayunas', array['GMP'], true, 25, 45, 'moderate', array['Digestivo','Intestinal','Inmunidad'], 'Probiótico de amplio espectro con 12 cepas seleccionadas.')
  returning id into v_p07_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'BRB-500-TR', 'Berberina HCl', 'Berberina HCl', '500mg', 'Thorne Research', 'metabolico', 21990, 13194, 60, '500mg x2 con comidas', array['GMP','NSF'], true, 31, 60, 'high', array['Resistencia Insulínica','Glucosa','Lípidos'], 'Berberina para soporte de metabolismo glucídico y lipídico.')
  returning id into v_p09_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'CRM-200-NF', 'Cromo Picolinato', 'Cromo Picolinato', '200mcg', 'NOW Foods', 'metabolico', 8990, 5394, 120, '1 cápsula con desayuno', array['GMP'], true, 83, 90, 'moderate', array['Insulina','Glucosa','Antojos'], 'Cromo picolinato para soporte de sensibilidad insulínica.')
  returning id into v_p10_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'NAC-600-LE', 'NAC', 'N-Acetil Cisteína', '600mg', 'Life Extension', 'metabolico', 16990, 10194, 60, '1 cápsula con desayuno', array['GMP'], true, 42, 60, 'moderate', array['Antioxidante','Hepático','SOP'], 'Precursor de glutatión para soporte antioxidante y hepático.')
  returning id into v_p11_id;

  insert into public.products (professional_id, sku, name, compound, dosage, brand, category, price, wholesale_price, units, per_day, certifications, in_stock, stock_qty, stock_days, evidence_level, conditions, description)
  values
    (v_pro_id, 'SEL-200-TR', 'Selenio', 'Selenometionina', '200mcg', 'Thorne Research', 'metabolico', 9990, 5994, 60, '1 cápsula con almuerzo', array['GMP','NSF'], true, 55, 90, 'high', array['Tiroides','Hipotiroidismo','Antioxidante'], 'Selenometionina orgánica para soporte tiroideo.')
  returning id into v_p12_id;

  -- PATIENTS
  insert into public.patients (professional_id, name, email, phone, age, condition, status, adherence, health_score, months_active, total_spent, since, last_order)
  values (v_pro_id, 'Camila Soto', 'camila.soto@gmail.com', '+56 9 1234 5678', 28, 'SOP + Resistencia Insulínica', 'active', 91, 94, 4, 152000, '2025-03-12', '2026-06-01')
  returning id into v_pat1_id;

  insert into public.patients (professional_id, name, email, phone, age, condition, status, adherence, health_score, months_active, total_spent, since, last_order)
  values (v_pro_id, 'Valentina Torres', 'vale.torres@gmail.com', '+56 9 2345 6789', 34, 'Hipotiroidismo', 'active', 85, 71, 3, 114000, '2025-04-15', '2026-05-20')
  returning id into v_pat2_id;

  insert into public.patients (professional_id, name, email, phone, age, condition, status, adherence, health_score, months_active, total_spent, since, last_order)
  values (v_pro_id, 'Francisca Muñoz', 'fran.munoz@gmail.com', '+56 9 3456 7890', 31, 'Resistencia Insulínica', 'active', 78, 62, 5, 190000, '2025-02-08', '2026-06-01')
  returning id into v_pat3_id;

  insert into public.patients (professional_id, name, email, phone, age, condition, status, adherence, health_score, months_active, total_spent, since, last_order)
  values (v_pro_id, 'Ana García', 'ana.garcia@gmail.com', '+56 9 4567 8901', 38, 'SOP', 'risk', 42, 35, 2, 76000, '2025-04-01', '2026-05-01')
  returning id into v_pat4_id;

  insert into public.patients (professional_id, name, email, phone, age, condition, status, adherence, health_score, months_active, total_spent, since, last_order)
  values (v_pro_id, 'Catalina Reyes', 'cata.reyes@gmail.com', '+56 9 5678 9012', 29, 'Déficit Vitamínico', 'active', 95, 88, 6, 228000, '2024-12-10', '2026-05-31')
  returning id into v_pat5_id;

  -- PROTOCOLS
  insert into public.protocols (professional_id, patient_id, name, status, health_score, subscription, monthly_value, total_generated, renewal_date, renewal_days, last_purchase)
  values (v_pro_id, v_pat1_id, 'Protocolo SOP Integral', 'active', 94, true, 63960, 255840, '2026-07-12', 8, 'Hace 3 días')
  returning id into v_prot1_id;

  insert into public.protocol_items (protocol_id, product_id, qty, instruction, days, status, days_left, sort_order) values
    (v_prot1_id, v_p01_id, 1, '2g mañana + 2g noche', 90, 'active', 42, 0),
    (v_prot1_id, v_p02_id, 1, '1 cápsula antes de dormir', 90, 'active', 42, 1),
    (v_prot1_id, v_p04_id, 1, '1 cápsula con almuerzo', 90, 'warning', 12, 2),
    (v_prot1_id, v_p03_id, 1, '1 cápsula con almuerzo', 90, 'active', 42, 3);

  insert into public.protocols (professional_id, patient_id, name, status, health_score, subscription, monthly_value, total_generated, renewal_date, renewal_days, last_purchase)
  values (v_pro_id, v_pat2_id, 'Protocolo Tiroides', 'active', 71, true, 36970, 110910, '2026-07-15', 11, 'Hace 15 días')
  returning id into v_prot2_id;

  insert into public.protocol_items (protocol_id, product_id, qty, instruction, days, status, days_left, sort_order) values
    (v_prot2_id, v_p06_id, 1, '1 cápsula en ayunas', 90, 'active', 35, 0),
    (v_prot2_id, v_p05_id, 1, '1 cápsula con cena', 90, 'active', 35, 1),
    (v_prot2_id, v_p12_id, 1, '1 cápsula con almuerzo', 90, 'active', 35, 2);

  insert into public.protocols (professional_id, patient_id, name, status, health_score, subscription, monthly_value, total_generated, renewal_date, renewal_days, last_purchase)
  values (v_pro_id, v_pat3_id, 'Protocolo RI Avanzado', 'active', 62, true, 63960, 319800, '2026-07-08', 4, 'Hace 10 días')
  returning id into v_prot3_id;

  insert into public.protocol_items (protocol_id, product_id, qty, instruction, days, status, days_left, sort_order) values
    (v_prot3_id, v_p09_id, 1, '500mg x2 con comidas', 90, 'active', 28, 0),
    (v_prot3_id, v_p10_id, 1, '1 cápsula con desayuno', 90, 'active', 28, 1),
    (v_prot3_id, v_p02_id, 1, '1 cápsula antes de dormir', 90, 'active', 28, 2),
    (v_prot3_id, v_p11_id, 1, '1 cápsula con desayuno', 90, 'warning', 14, 3);

  -- ALERTS
  insert into public.alerts (professional_id, patient_id, protocol_id, type, icon, text, action_label) values
    (v_pro_id, v_pat1_id, v_prot1_id, 'warning', 'clock', 'Camila Soto — Vitamina D3 termina en 12 días', 'Enviar recordatorio'),
    (v_pro_id, v_pat4_id, null, 'danger', 'x', 'Ana García — suscripción cancelada ayer', 'Contactar'),
    (v_pro_id, v_pat5_id, null, 'success', 'check', 'Catalina Reyes completó 6 meses de tratamiento', 'Felicitar');

  -- TIMELINE EVENTS
  insert into public.events (professional_id, patient_id, protocol_id, type, icon, color, text, detail, amount) values
    (v_pro_id, v_pat1_id, v_prot1_id, 'purchase', 'cart', 'emerald', 'Compra completada — $63.960', 'Camila Soto — 4 suplementos — Webpay', 63960),
    (v_pro_id, v_pat3_id, v_prot3_id, 'subscription', 'refresh', 'violet', 'Renovación mensual automática', 'Suscripción activa — mes 4', 63960),
    (v_pro_id, v_pat5_id, null, 'milestone', 'star', 'emerald', 'Catalina Reyes completó 6 meses de tratamiento', 'Hito de adherencia', null);

  raise notice 'Seed completed. Professional ID: %', v_pro_id;
  raise notice 'IMPORTANT: Update user_id in professionals table to match your real Supabase Auth user_id';
end $$;
