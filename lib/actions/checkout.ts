'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { createFlowPayment } from '@/lib/flow';

function serviceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

interface CheckoutInput {
  planId: string;
  planToken: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  region: string;
}

export async function initiateCheckout(input: CheckoutInput) {
  const supabase = serviceRole();

  const { data: plan, error } = await supabase
    .from('plans')
    .select(`
      id, title, status, professional_id,
      professionals ( discount_mode, discount_value ),
      plan_items (
        id, quantity,
        products ( id, name, price )
      )
    `)
    .eq('id', input.planId)
    .eq('public_token', input.planToken)
    .single();

  if (error || !plan) throw new Error('Protocolo no encontrado o no disponible.');
  if (['draft', 'cancelled', 'expired', 'purchased'].includes(plan.status)) {
    throw new Error('Este protocolo no está disponible para compra.');
  }

  const professional = plan.professionals as any;
  const items = (plan.plan_items ?? []) as any[];

  const subtotal = items.reduce((s: number, i: any) => s + (i.products?.price ?? 0) * (i.quantity ?? 1), 0);
  const commissionPct = professional?.discount_mode === 'percentage'
    ? (professional.discount_value ?? 15)
    : 15;
  const commissionAmt = Math.round(subtotal * commissionPct / 100);
  const total = subtotal + commissionAmt;

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      plan_id: plan.id,
      professional_id: plan.professional_id,
      status: 'pending_payment',
      subtotal,
      commission_pct: commissionPct,
      commission_amt: commissionAmt,
      total,
      patient_name: input.name,
      patient_email: input.email,
      shipping_address: {
        address: input.address,
        city: input.city,
        region: input.region,
        phone: input.phone,
      },
    })
    .select('id')
    .single();

  if (orderErr || !order) throw new Error('Error creando la orden. Intenta nuevamente.');

  await supabase.from('order_items').insert(
    items.map((i: any) => ({
      order_id: order.id,
      product_id: i.products?.id,
      quantity: i.quantity ?? 1,
      unit_price: i.products?.price ?? 0,
      total_price: (i.products?.price ?? 0) * (i.quantity ?? 1),
    }))
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const flowPayment = await createFlowPayment({
    commerceOrder: order.id,
    subject: plan.title,
    amount: total,
    email: input.email,
    urlConfirmation: `${appUrl}/api/payments/flow-webhook`,
    urlReturn: `${appUrl}/checkout/success?order=${order.id}`,
  });

  await supabase
    .from('orders')
    .update({ flow_order_id: String(flowPayment.flowOrder), flow_payment_url: flowPayment.url })
    .eq('id', order.id);

  await supabase.from('payments').insert({
    order_id: order.id,
    provider: 'flow',
    provider_payment_id: flowPayment.token,
    status: 'pending',
    amount: total,
    currency: 'CLP',
    metadata: { flow_order: flowPayment.flowOrder, token: flowPayment.token },
  });

  redirect(flowPayment.url);
}
