import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendRenewalReminder } from '@/lib/email';

// Anon client — get_expiring_plans RPC corre con SECURITY DEFINER
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = anonClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vitalink-mvp.vercel.app';

  const today = new Date();
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);
  const dateStr = in7Days.toISOString().split('T')[0];

  const { data: plans, error } = await supabase.rpc('get_expiring_plans', {
    p_target_date: dateStr,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = [];
  for (const plan of plans ?? []) {
    if (!plan.patient_email) continue;

    await sendRenewalReminder({
      to: plan.patient_email,
      patientName: plan.patient_name ?? 'Paciente',
      protocolName: plan.title,
      link: `${appUrl}/p/${plan.public_token}`,
      renewalDate: new Date(plan.expires_at).toLocaleDateString('es-CL'),
    });

    results.push({ planId: plan.id, to: plan.patient_email });
  }

  return NextResponse.json({ sent: results.length, plans: results });
}
