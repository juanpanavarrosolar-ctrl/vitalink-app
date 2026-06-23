import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getFlowPaymentStatus } from '@/lib/flow';
import { sendOrderConfirmation } from '@/lib/email';

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const token = body.get('token') as string;
    if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 });

    const flowStatus = await getFlowPaymentStatus(token);
    const supabase = serviceRole();

    const { data: payment } = await supabase
      .from('payments')
      .select('id, order_id, amount')
      .eq('provider_payment_id', token)
      .single();

    if (!payment) return NextResponse.json({ error: 'payment not found' }, { status: 404 });

    const paid = flowStatus.status === 2;
    const rejected = flowStatus.status === 3 || flowStatus.status === 4;

    const newStatus = paid ? 'paid' : rejected ? 'failed' : 'pending';

    await supabase
      .from('payments')
      .update({
        status: newStatus,
        raw_webhook: flowStatus,
        metadata: { flow_order: flowStatus.flowOrder, media: flowStatus.paymentData?.media },
      })
      .eq('id', payment.id);

    if (paid) {
      const { data: order } = await supabase
        .from('orders')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', payment.order_id)
        .select('id, patient_email, patient_name, total, plan_id')
        .single();

      if (order) {
        await supabase
          .from('plans')
          .update({ status: 'purchased' })
          .eq('id', order.plan_id);

        if (order.patient_email) {
          await sendOrderConfirmation({
            to: order.patient_email,
            patientName: order.patient_name ?? 'Paciente',
            orderTotal: order.total,
            orderId: order.id,
          });
        }
      }
    } else if (rejected) {
      await supabase
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', payment.order_id);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Flow webhook error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
