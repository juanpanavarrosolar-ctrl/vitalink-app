import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getFlowPaymentStatus } from '@/lib/flow';
import { sendOrderConfirmation } from '@/lib/email';

// Anon client — process_flow_webhook RPC corre con SECURITY DEFINER
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const token = body.get('token') as string;
    if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 });

    const flowStatus = await getFlowPaymentStatus(token);
    const supabase = anonClient();

    const { data: result, error } = await supabase.rpc('process_flow_webhook', {
      p_flow_token: token,
      p_flow_status: flowStatus.status,
      p_raw_webhook: { flow_order: flowStatus.flowOrder, media: flowStatus.paymentData?.media },
    });

    if (error || !result) {
      console.error('process_flow_webhook error:', error);
      return NextResponse.json({ error: 'webhook processing failed' }, { status: 500 });
    }

    if (result.error === 'payment_not_found') {
      return NextResponse.json({ error: 'payment not found' }, { status: 404 });
    }

    // Enviar email de confirmación si el pago fue exitoso
    if (result.paid && result.patient_email) {
      await sendOrderConfirmation({
        to: result.patient_email,
        patientName: result.patient_name ?? 'Paciente',
        orderTotal: result.total,
        orderId: result.order_id,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Flow webhook error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
