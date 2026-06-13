import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// ONE-TIME dev route — creates admin and nutri demo users.
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
// GET /api/dev-setup  →  runs setup and returns result
export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const skey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!skey) {
    return NextResponse.json({
      error: 'SUPABASE_SERVICE_ROLE_KEY not set. Add it to .env.local from Dashboard > Settings > API > service_role key.'
    }, { status: 500 });
  }

  const admin = createClient(url, skey, { auth: { autoRefreshToken: false, persistSession: false } });
  const results: Record<string, unknown> = {};

  // ── Admin user ─────────────────────────────────────────────────────────────
  const { data: adminData, error: adminErr } = await admin.auth.admin.createUser({
    email: 'admin@nutrilink.cl',
    password: 'admin1',
    email_confirm: true,
    user_metadata: { name: 'Administrador NutriLink', role: 'admin' },
  });
  results.admin = adminErr
    ? { error: adminErr.message }
    : { id: adminData.user.id, email: adminData.user.email };

  // ── Nutri user ─────────────────────────────────────────────────────────────
  const { data: nutriData, error: nutriErr } = await admin.auth.admin.createUser({
    email: 'nutri@nutrilink.cl',
    password: 'nutri1',
    email_confirm: true,
    user_metadata: { name: 'Dra. Carmen Silva', role: 'professional' },
  });
  results.nutri = nutriErr
    ? { error: nutriErr.message }
    : { id: nutriData.user.id, email: nutriData.user.email };

  // ── Professional record for nutri ──────────────────────────────────────────
  if (!nutriErr && nutriData?.user) {
    const nutriId = nutriData.user.id;
    const { error: profErr } = await admin
      .from('professionals')
      .insert({
        user_id: nutriId,
        full_name: 'Dra. Carmen Silva',
        profession: 'Nutricionista',
        license_number: 'RUT 15.678.901-2',
        specialty: 'Nutrición Deportiva y Funcional',
        clinic_name: 'Clínica NutriVida',
        verification_status: 'verified',
        discount_mode: 'percentage',
        discount_value: 20,
      });
    results.professionalRecord = profErr ? { error: profErr.message } : 'created';

    // ── Patient record linked to nutri professional ────────────────────────
    if (!profErr) {
      const { data: profRec } = await admin
        .from('professionals')
        .select('id')
        .eq('user_id', nutriId)
        .single();

      if (profRec) {
        const { data: p1 } = await admin.from('products').select('id').ilike('name', 'Omega%').single();
        const { data: p2 } = await admin.from('products').select('id').ilike('name', 'Vitamina D3%').single();
        const { data: p3 } = await admin.from('products').select('id').ilike('name', 'Magnesio%').single();

        const { data: patRec, error: patErr } = await admin
          .from('patients')
          .insert({
            professional_id: profRec.id,
            name: 'Juan Demo Paciente',
            email: 'paciente@nutrilink.cl',
            phone: '+56 9 9876 5432',
            birth_year: 1992,
            consent_status: 'accepted',
          })
          .select('id')
          .single();

        if (!patErr && patRec && p1 && p2 && p3) {
          const { data: plan, error: planErr } = await admin
            .from('plans')
            .insert({
              professional_id: profRec.id,
              patient_id: patRec.id,
              title: 'Protocolo Rendimiento & Energía',
              status: 'sent',
              duration_days: 90,
              notes: 'Plan personalizado para optimizar rendimiento físico, energía y recuperación muscular.',
            })
            .select('id')
            .single();

          if (!planErr && plan) {
            await admin.from('plan_items').insert([
              { plan_id: plan.id, product_id: p1.id, quantity: 1, instructions: 'Tomar con el almuerzo junto a alimentos grasos.', frequency: '1 vez al día', duration_days: 90 },
              { plan_id: plan.id, product_id: p2.id, quantity: 1, instructions: 'Tomar en la mañana con el desayuno.', frequency: '1 vez al día', duration_days: 90 },
              { plan_id: plan.id, product_id: p3.id, quantity: 1, instructions: 'Tomar antes de dormir para mejor absorción.', frequency: '1 vez al día', duration_days: 90 },
            ]);
            results.patientAndPlan = 'created';
          }
        }
      }
    }
  }

  return NextResponse.json({ success: true, results });
}
