import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendRenewalReminder } from '@/lib/email';

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = serviceRole();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  const today = new Date();
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);
  const dateStr = in7Days.toISOString().split('T')[0];

  const { data: plans } = await supabase
    .from('plans')
    .select('id, title, public_token, expires_at, patients(name, email)')
    .in('status', ['purchased', 'sent', 'viewed'])
    .gte('expires_at', `${dateStr}T00:00:00Z`)
    .lt('expires_at', `${dateStr}T23:59:59Z`);

  const results = [];
  for (const plan of plans ?? []) {
    const patient = plan.patients as any;
    if (!patient?.email) continue;

    await sendRenewalReminder({
      to: patient.email,
      patientName: patient.name ?? 'Paciente',
      protocolName: plan.title,
      link: `${appUrl}/p/${plan.public_token}`,
      renewalDate: new Date(plan.expires_at).toLocaleDateString('es-CL'),
    });

    results.push({ planId: plan.id, to: patient.email });
  }

  return NextResponse.json({ sent: results.length, plans: results });
}
